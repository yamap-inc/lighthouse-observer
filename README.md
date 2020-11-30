# lighthouse-observer

Google Cloud Functions で Lighthouse を定点観測します。  
データポータルからスプレッドシートに接続し、経過をグラフで可視化できます。

🔭

## 構成
![ligthouse-observer-architecture](https://dl.dropboxusercontent.com/s/0bdsgy38ah6wzih/ligthouse-observer-architecture.png)

## 設定

1. Cloud SDK をインストールする
1. スプレッドシートを作成する
1. Google Cloud Pub/Sub にトピックを作成する
1. Google Cloud Scheduler を設定する
1. Google Cloud Functions に lighthouse-observer をデプロイする
1. データポータルで可視化する

### Cloud SDK をインストールする

https://cloud.google.com/sdk?hl=ja
### スプレッドシートを作成する

スプレッドシートを作成して、スプレッドシートの id を控えておく。  
GCP プロジェクトのサービスアカウントに作成したスプレッドシートを共有する。
スプレッドシートには以下の順でヘッダーを作成する。

```
"fetch_time", "requested_url", "first_contentful_paint", "speed_index", "largest_contentful_paint", "interactive", "total_blocking_time", "cumulative_layout_shift", "first_cpu_idle", "max_potential_fid", "first_meaningful_paint", "estimated_input_latency", "server_response_time", "mainthread_work_breakdown", "bootup_time", "network_server_latency", "performance", "accessibility", "best_practices", "seo", "pwa"
```
### Google Cloud Pub/Sub にトピックを作成する

任意の名前でトピックを作成する。

### Google Cloud Scheduler を設定する

以下の内容でスケジューラーを作成する。

|設定項目|入力内容|
|:--|:--|
|説明|（任意）|
|頻度|（任意）|
|タイムゾーン|（任意）|
|ターゲット|`Pub/Sub`|
|トピック|作成したトピック名|
|ペイロード|指定の形式で入力（※1）|

#### ※1 ペイロードの形式

```json
{
  "targets": [
    {
      "url": "https://yamap.com", // 計測対象のURL
      "sheetName": "top" // 結果を書き込むシートの名前
    }
  ],
  "spreadsheetId": "xxxxxxxxxxxxxxxxxx",
  "timezone": "Asia/Tokyo"
}
```

### Google Cloud Functions に lighthouse-observer をデプロイする

```bash
# init project
cd ~/your/git/lighthouse-observer
npm ci
npm run transpile

# deploy
gcloud functions deploy runLighthouseObserver --trigger-topic lighthouse-observer --runtime nodejs10 --memory 2048 --region asia-northeast1 --timeout 540 --max-instances 5
```

### データポータルで可視化する

https://support.google.com/datastudio#topic=6267740
