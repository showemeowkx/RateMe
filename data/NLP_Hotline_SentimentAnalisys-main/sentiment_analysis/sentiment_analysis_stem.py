import pandas as pd
import numpy as np
from langdetect import detect, DetectorFactory
import re
from stop_words import get_stop_words
from snowballstemmer import RussianStemmer
from uk_stemmer import UkStemmer
import joblib
from sklearn.metrics import classification_report
from deep_translator import GoogleTranslator
DetectorFactory.seed = 0


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


russian_stemmer = RussianStemmer()
def stem_russian(text):
    words = text.split()
    return " ".join([russian_stemmer.stemWord(word) for word in words])


ukrainian_stemmer = UkStemmer()
def stem_ukrainian(text):
    words = text.split()
    return " ".join([ukrainian_stemmer.stem_word(word) for word in words])


def translate_to_russian_if_ukrainian(text, lang):
    if lang == "uk":
        try:
            return GoogleTranslator(source='uk', target='ru').translate(text)
        except Exception as e:
            print(f"Translation error: {e}")
            return text
    return text


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


def get_review(data):
    data["recommend"] = np.where(data['recommend'] == 'рекомендує цей товар', 1, 0)
    data = data[["recommend", "liked", "disliked", "experience", "comment"]].copy()
    data["experience"] = data["experience"].apply(process_exp)
    for col in ["liked", "disliked", "comment"]:
        data[col] = data[col].apply(clean_text)
    df = data[["recommend", "experience", "liked", "disliked", "comment"]].copy()
    df["language"] = df["comment"].apply(detect_lang)
    df["language"] = df["language"].apply(lambda x: "uk" if x not in ["uk", "ru"] else ("ru" if x == "ru" else "uk"))

    # df["liked"] = df.apply(lambda row: translate_to_russian_if_ukrainian(row["liked"], row["language"]), axis=1)
    # df["disliked"] = df.apply(lambda row: translate_to_russian_if_ukrainian(row["disliked"], row["language"]), axis=1)
    #df["comment"] = df.apply(lambda row: translate_to_russian_if_ukrainian(row["comment"], row["language"]), axis=1)

    df["liked"] = df["liked"].apply(processing)
    df["disliked"] = df["disliked"].apply(processing)
    df["comment"] = df["comment"].apply(processing)
    for col in ["liked", "disliked", "comment"]:
        df[col] = df.apply(
            lambda row: stem_ukrainian(row[col]) if row["language"] == "uk" else stem_russian(row[col]),
            axis=1)
    return df


tfidf_liked = joblib.load('tfidf_liked.pkl')
tfidf_disliked = joblib.load('tfidf_disliked.pkl')
tfidf_comment = joblib.load('tfidf_comment.pkl')
xgb_model = joblib.load('xgb_clf.pkl')

data = pd.read_csv("test_reviews/my_test_reviews1-50.csv")
df = get_review(data)

X_tfidf_liked = pd.DataFrame(tfidf_liked.transform(df["liked"]).toarray(), columns=["liked_" + f for f in tfidf_liked.get_feature_names_out()])
X_tfidf_disliked = pd.DataFrame(tfidf_disliked.transform(df["disliked"]).toarray(), columns=["disliked_" + f for f in tfidf_disliked.get_feature_names_out()])
X_tfidf_comment = pd.DataFrame(tfidf_comment.transform(df["comment"]).toarray(), columns=["comment_" + f for f in tfidf_comment.get_feature_names_out()])

x_tfidf = pd.concat([
    X_tfidf_liked.reset_index(drop=True),
    X_tfidf_disliked.reset_index(drop=True),
    X_tfidf_comment.reset_index(drop=True),
    df[["experience"]].reset_index(drop=True)
], axis=1)

y_tfidf = df["recommend"]
y_pred = xgb_model.predict(x_tfidf)

print(classification_report(y_tfidf, y_pred))
print(pd.DataFrame({
    "true": y_tfidf,
    "pred": y_pred
}))