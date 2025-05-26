from flask import Flask, request, jsonify, abort
from flask_cors import CORS
import random
import time

app = Flask(__name__)
CORS(app)

# Генерация случайных значений при старте
click_counters = {
    "1": random.randint(0, 10**10),
    "2": random.randint(0, 10**10),
    "3": random.randint(0, 10**10),
    "4": random.randint(0, 10**10),
    "5": random.randint(0, 10**10),
    "6": random.randint(0, 10**10),
}

# Сопоставление ID → slug
phrase_slugs = {
    "1": "shylily-womp-womp",
    "2": "calli-ara-ara",
    "3": "filian-ara-ara",
    "4": "gura-ara-ara",
    "5": "shylily-ara-ara",
    "6": "kobo-ara-ara",
}

# Получить общее значение по ID
def get_total(phrase_id: str) -> int:
    return click_counters.get(phrase_id, 0)

# Обновить значение (инкремент)
def update_total(phrase_id: str, amount: int) -> int:
    clicks = get_total(phrase_id) + amount
    click_counters[phrase_id] = clicks
    return clicks

# GET: получить общее количество кликов по ID
@app.route('/api/phrases/<phrase_id>/total', methods=['GET'])
def handle_get_total(phrase_id):
    clicks = get_total(phrase_id)
    slug = phrase_slugs.get(phrase_id, "unknown")
    return jsonify({ 'data': { 'clicks': clicks, 'slug': slug } })

# POST: добавить количество кликов
@app.route('/api/phrases/<phrase_id>/click', methods=['POST'])
def handle_post_click(phrase_id):
    time.sleep(3)
    if not request.is_json:
        abort(400, description='Ожидается JSON')
    body = request.get_json()
    if 'amount' not in body or not isinstance(body['amount'], (int, float)):
        abort(400, description='Неверный формат поля "amount"')

    amount = int(body['amount'])
    clicks = update_total(phrase_id, amount)
    slug = phrase_slugs.get(phrase_id, "unknown")
    return jsonify({ 'data': { 'clicks': clicks, 'slug': slug } })

# Новый эндпоинт: общая сумма всех кликов
@app.route('/api/total-clicks', methods=['GET'])
def handle_total_clicks():
    total_clicks = sum(click_counters.values())
    return jsonify({ 'totalClicks': total_clicks })

# Старт
if __name__ == '__main__':
    print("Начальные данные (при старте):")
    for pid, val in click_counters.items():
        print(f"id {pid}: {val} кликов")
    app.run(host='0.0.0.0', port=5000, debug=True)
