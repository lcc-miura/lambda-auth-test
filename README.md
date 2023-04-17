# Auth0
  ## 要件
    ユーザー登録時、
    ・Drits に user を登録する
    ・登録された user の userKey を Auth0 の user_metadata に保存する
      Auth0(Action) -> Lambda(function URLs) -> Drits Mgr API

  ## 詳細要件
    ・一意なuser_idをLambdaにパラメーターとして渡したい
    ・app_metadataにuser_keyを保存したい

  ## トリガー
    ・pre-user-registration
      setAppMetadataが使えるがuser_idが取得できない

    ・post-user-registration
      user_idが取得できるがsetAppMetadataが使えない

    ・login/post-login
      どちらも対応可能（判定が必要）　←　採用
  
  ## 環境変数
    Secretsに追加
      - LAMBDA_ENDPOINT
        Lambda Function URLsのエンドポイント

  ## 依存ライブラリ（外部モジュール）
    Dependenciesに追加
      - @aws-sdk/protocol-http
      - @aws-sdk/signature-v4
      - @aws-crypto/sha256-universal
      - axios

  ## 機能拡張
    Extensions
      ・Real-time Webtask Logs
        リアルタイムデバック用

  ## 検証済み
    クライアントにはReactとNext.jsを使用

***

# Lambda
  ## 要件
    ・Function URLs での呼び出し
      検証済み
        IAM認証無し
        CORS設定無し

    ・VPC に入れる
      検証済み
        VPCにLambdaを接続
        起動済みのEC2にてSSMを使用し、任意のディレクトリに任意のファイルを作成

    ・仮の userKey として現在時刻を返す　←　パラメータを含めて返す
      検証済み
        クエリストリングでのパラメーターの受け渡し

  ## ランタイム
    Node.js 16
