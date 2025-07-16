- データ出典: https://www.data.jma.go.jp/developer/gpv_sample.html
  - 局地数値予報モデルＧＰＶ (ＬＦＭ)

- RGBエンコーディング手順
```
# ────────────────────────────────────────────────
# Step ①  風ベクトル成分（U=東西風・V=南北風）を GRIB2 から抽出
#           -match には “10 m 上” のレイヤを示す正規表現を指定
#           出力形式はそのまま GRIB2（-grib オプション）。
#           ─▶ u.grib / v.grib が生成される
# ────────────────────────────────────────────────
wgrib2 Z__C_RJTD_20221221010000_LFM_GPV_Rjp_Lsurf_FH0100_grib2.bin \
       -match ":UGRD:10 m" -grib u.grib         # U 成分（R チャンネル用）
wgrib2 Z__C_RJTD_20221221010000_LFM_GPV_Rjp_Lsurf_FH0100_grib2.bin \
       -match ":VGRD:10 m" -grib v.grib         # V 成分（G/B チャンネル用）

# ────────────────────────────────────────────────
# Step ②  U・V を 3 バンド VRT に結合
#           R = U   G = V   B = V（G を複製）
#           → wind.vrt には 1201×1261 の 3 バンド仮想ラスタが出来る
# ────────────────────────────────────────────────
gdalbuildvrt -separate wind.vrt u.grib v.grib v.grib

# ────────────────────────────────────────────────
# Step ③  座標参照系 (EPSG:4326, 緯度経度) を明示
#           gdalbuildvrt が SRS を継承しない場合の保険
# ────────────────────────────────────────────────
gdal_edit.py -a_srs EPSG:4326 wind.vrt

# ────────────────────────────────────────────────
# Step ④  8-bit へ線形スケールして PNG 化
#           元値 -20〜+20 m s⁻¹ → 0〜255 にマッピング
#           ─▶ wind_rgb_20.png（R=U, G=V, B=V）完成
# ────────────────────────────────────────────────
gdal_translate -ot Byte -scale -20 20 0 255 \
               wind.vrt wind_rgb_20.png
```
