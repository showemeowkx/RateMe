FROM python:3.10.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --default-timeout=100 -r requirements.txt

COPY . .

EXPOSE ${MODEL_PORT}

CMD ["python", "data/server/server.py"]