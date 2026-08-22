"""気象庁(JMA)のAPIを使って福岡市の天気予報を取得して表示する。"""

import json
import sys
import urllib.error
import urllib.request

FORECAST_URL = "https://www.jma.go.jp/bosai/forecast/data/forecast/400000.json"
FUKUOKA_DISTRICT_CODE = "400010"  # 福岡地方(福岡市を含む)
FUKUOKA_CITY_CODE = "82182"  # 気温の代表地点: 福岡


def fetch_forecast():
    with urllib.request.urlopen(FORECAST_URL, timeout=10) as response:
        data = json.load(response)
    return data[0]  # 短期予報(3日分)


def find_area(time_series_entry, code):
    for area in time_series_entry["areas"]:
        if area["area"]["code"] == code:
            return area
    raise ValueError(f"area code {code} not found")


def _group_by_date(dates, values):
    """timeDefinesの日付部分ごとに値をまとめる(pop/tempは1日に複数の観測時刻を持つため)。"""
    grouped = {}
    for date, value in zip(dates, values):
        if not value:
            continue
        day = date[:10]
        grouped.setdefault(day, []).append(value)
    return grouped


def extract_weather(forecast):
    time_series = forecast["timeSeries"]

    weather_area = find_area(time_series[0], FUKUOKA_DISTRICT_CODE)
    weather_dates = time_series[0]["timeDefines"]
    weathers = weather_area["weathers"]

    pop_area = find_area(time_series[1], FUKUOKA_DISTRICT_CODE)
    pop_by_day = _group_by_date(time_series[1]["timeDefines"], pop_area["pops"])

    temp_area = find_area(time_series[2], FUKUOKA_CITY_CODE)
    temp_by_day = _group_by_date(time_series[2]["timeDefines"], temp_area["temps"])

    forecasts = []
    for date, weather in zip(weather_dates, weathers):
        day = date[:10]
        forecasts.append(
            {
                "date": day,
                "weather": weather,
                "pops": pop_by_day.get(day, []),
                "temps": temp_by_day.get(day, []),
            }
        )
    return forecasts


def main():
    try:
        forecast = fetch_forecast()
    except urllib.error.URLError as e:
        print(f"天気予報の取得に失敗しました: {e}", file=sys.stderr)
        sys.exit(1)

    forecasts = extract_weather(forecast)

    print("福岡市の天気予報")
    print("=" * 40)
    for item in forecasts:
        print(f"日付: {item['date']}")
        print(f"  天気: {item['weather']}")
        pops = item["pops"]
        print(f"  降水確率: {'% / '.join(pops)}%" if pops else "  降水確率: -")
        temps = item["temps"]
        print(f"  気温: {' / '.join(temps)}℃" if temps else "  気温: -")
        print()


if __name__ == "__main__":
    main()
