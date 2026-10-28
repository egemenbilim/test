@echo off
title Sinavci - Test ve Foyu Hazirlama Studyosu
cls

echo ============================================================
echo           SINAVCI - EGEMEN'S TESTMAKER STUDYOSU
echo    Test, Yazili Sinav ve Konu Foyu Hazirlama Platformu
echo ============================================================
echo.
echo [1/2] Sunucu baslatiliyor...
echo       Adres: http://localhost:8080/
echo       Atolyeler:
echo         * Yaprak Test  : http://localhost:8080/test
echo         * Yazili Sinav : http://localhost:8080/yazili
echo         * Konu Foyu    : http://localhost:8080/foy
echo         * Soru Havuzu  : http://localhost:8080/havuz
echo.
echo [2/2] Tarayici otomatik acilacaktir.
echo       Kapatmak icin bu pencereyi kapatabilir veya Ctrl+C yapabilirsiniz.
echo ============================================================
echo.

cd /d "%~dp0"

python -B server.py --open
if %ERRORLEVEL% neq 0 (
    echo [BILGI] 'python' ile baslatilamadi, 'py' ile deneniyor...
    py -B server.py --open
)
if %ERRORLEVEL% neq 0 (
    echo [BILGI] Dogrudan Python 3.12 yolu deneniyor...
    "C:\Users\egeme\AppData\Local\Programs\Python\Python312\python.exe" -B server.py --open
)

echo.
echo Sunucu durduruldu.
pause
