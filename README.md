- データ出典: https://www.data.jma.go.jp/developer/gpv_sample.html
  - メソ数値予報モデルＧＰＶ (ＭＳＭ)
    - 日本とその近海の領域を全球数値予報モデルよりも細かい格子間隔（5km）で、未来の気温、風、水蒸気量、日射量等の状態について、スーパーコンピュータを用いて3次元の格子で予測したデータ。39時間先まで（9時、21時（日本時間）初期値のものに限り78時間先まで）の予測を３時間毎に発表。
- RGBエンコーディング手順
```
# UGRD 一覧
wgrib2 Z__C_RJTD_20171205000000_MSM_GPV_Rjp_Lsurf_FH00-15_grib2.bin -match ":UGRD:10 m" -s

# VGRD 一覧
wgrib2 Z__C_RJTD_20171205000000_MSM_GPV_Rjp_Lsurf_FH00-15_grib2.bin -match ":VGRD:10 m" -s

# ① 解析値 (anl) だけを抽出　── ファイルは 1 バンドだけになる
wgrib2 Z__C_RJTD_20171205000000_MSM_GPV_Rjp_Lsurf_FH00-15_grib2.bin \
       -match ":UGRD:10 m above ground:anl:" -grib u.grib

wgrib2 Z__C_RJTD_20171205000000_MSM_GPV_Rjp_Lsurf_FH00-15_grib2.bin \
       -match ":VGRD:10 m above ground:anl:" -grib v.grib

# ② R=U, G=V, B=V で 3 バンド VRT → PNG
gdalbuildvrt -separate wind.vrt u.grib v.grib v.grib
gdal_edit.py -a_srs EPSG:4326 wind.vrt               # 座標参照系を明示

# ③ ±20 m s⁻¹ を 0–255 に線形スケール → PNG
gdal_translate -ot Byte -scale -20 20 0 255 \
               wind.vrt wind_rgb.png
```
