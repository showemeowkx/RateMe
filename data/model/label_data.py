import pandas as pd
import numpy as np
from langdetect import detect, DetectorFactory
import re
from stop_words import get_stop_words
import joblib
from sklearn.metrics import classification_report
import pymorphy2
import json
DetectorFactory.seed = 0

# pymorphy2 для обох мов
morph_uk = pymorphy2.MorphAnalyzer(lang='uk')
morph_ru = pymorphy2.MorphAnalyzer()

def detect_lang(text):
    if len(text) < 3:
        return None
    try:
        lang = detect(text)
        return lang
    except Exception as e:
        return None


def process_exp(word):
    if word == "кілька годин":
        return 1
    elif word == "кілька днів":
        return 2
    elif word == "кілька тижнів":
        return 3
    elif word == "кілька місяців":
        return 4
    elif word == "рік і більше":
        return 5
    else:
        return np.nan


def clean_text(text):
    if pd.isna(text):
        return ""
    return str(text).replace("\r", "")

def lemmatize_uk(text):
    return " ".join([morph_uk.parse(word)[0].normal_form for word in text.split()])

def lemmatize_ru(text):
    return " ".join([morph_ru.parse(word)[0].normal_form for word in text.split()])



stopwords_ru = set(get_stop_words("ru"))
stopwords_uk = set(get_stop_words("uk"))
stopwords_ru.remove("не")
stopwords_uk.remove("не")
all_stopwords = stopwords_ru | stopwords_uk
def processing(review):
    review = re.sub('[^a-zA-Zа-яА-Я]', ' ', review)
    review = review.lower()
    review = review.split()
    review = [word for word in review if word not in set(all_stopwords)]
    review = ' '.join(review)
    return review


def get_review(values_list):
    experience, liked, disliked, comment = values_list
    data = pd.DataFrame([{
        "experience": experience,
        "liked": liked,
        "disliked": disliked,
        "comment": comment
    }])
    data["experience"] = data["experience"].apply(process_exp)

    for col in ["liked", "disliked", "comment"]:
        data[col] = data[col].apply(clean_text)

    df = data[["experience", "liked", "disliked", "comment"]].copy()

    df["language"] = df["comment"].apply(detect_lang)
    df["language"] = df["language"].apply(lambda x: "uk" if x not in ["uk", "ru"] else ("ru" if x == "ru" else "uk"))

    df["liked"] = df["liked"].apply(processing)
    df["disliked"] = df["disliked"].apply(processing)
    df["comment"] = df["comment"].apply(processing)

    for col in ["liked", "disliked", "comment"]:
        df[col] = df[col].apply(processing)
        df[col] = df.apply(
            lambda row: lemmatize_uk(row[col]) if row["language"] == "uk" else lemmatize_ru(row[col]),
            axis=1
        )
        df[col + "_len"] = df[col].apply(lambda x: len(x.split()))
    return df

def load_models():
    tfidf_liked = joblib.load('data/NLP_Hotline_SentimentAnalisys-main/pkl_models/tfidf_liked.pkl')
    tfidf_disliked = joblib.load('data/NLP_Hotline_SentimentAnalisys-main/pkl_models/tfidf_disliked.pkl')
    tfidf_comment = joblib.load('data/NLP_Hotline_SentimentAnalisys-main/pkl_models/tfidf_comment.pkl')
    model = joblib.load('data/NLP_Hotline_SentimentAnalisys-main/pkl_models/model.pkl')
    return tfidf_liked, tfidf_disliked, tfidf_comment, model

def label_data(values_list, tfidf_liked, tfidf_disliked, tfidf_comment, model):
    df = get_review(values_list)
    unmarked_data = df[["experience", "liked", "disliked", "comment"]].copy()

    x_tfidf_liked = pd.DataFrame(tfidf_liked.transform(unmarked_data["liked"]).toarray(), columns=["liked_" + f for f in tfidf_liked.get_feature_names_out()])
    x_tfidf_disliked = pd.DataFrame(tfidf_disliked.transform(unmarked_data["disliked"]).toarray(), columns=["disliked_" + f for f in tfidf_disliked.get_feature_names_out()])
    x_tfidf_comment = pd.DataFrame(tfidf_comment.transform(unmarked_data["comment"]).toarray(), columns=["comment_" + f for f in tfidf_comment.get_feature_names_out()])

    x_tfidf = pd.concat([
        x_tfidf_liked.reset_index(drop=True),
        x_tfidf_disliked.reset_index(drop=True),
        x_tfidf_comment.reset_index(drop=True),
        unmarked_data[["experience"]].reset_index(drop=True)
    ], axis=1)
    y_pred_prob = model.predict_proba(x_tfidf)[:, 1]
    y_pred = (y_pred_prob > 0.4).astype(int)
    return y_pred

def main(example):
    tfidf_liked, tfidf_disliked, tfidf_comment, model = load_models()
    values_list = [example[k] for k in ["experience", "liked", "disliked", "comment"]]
    is_recommended = label_data(values_list, tfidf_liked, tfidf_disliked, tfidf_comment, model)
    print(is_recommended)

main(example)