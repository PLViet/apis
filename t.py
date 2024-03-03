from selenium import webdriver
import re

options = webdriver.ChromeOptions()

cookie_string = "__LOCALE__null=VN; _gcl_au=1.1.1563516775.1709360611; csrftoken=bxo2nu4QYEB4A4uzRcd4TzdCqv3qpwo0; SPC_SI=uS/cZQAAAABnbkJHUXRVbuUQLQEAAAAAUGd2cFJNVFg=; SPC_SEC_SI=v1-MjJ3SWpZTG5rWmJyWUpMbiY95Rlk/QwBKBQqMDPGajd3fLJUicm7ha39lo6/Zb6eGHI6tHgLsz7lgcFmMdQ8QaWw+MZa7QUCDDrWrqiyPkI=; SPC_F=DcuCq2Coc614c9RTKB6PN5ThaCpTA59Y; REC_T_ID=3ea81384-d85d-11ee-9b4d-f203e3e485f7; _fbp=fb.1.1709360611809.1545075362; _sapid=7668572795adb542abb972061fdb979dd80c130ef40310be3ce95f37; _QPWSDCXHZQA=3c241683-da66-4fa6-c797-7b8965ee34a1; REC7iLP4Q=59861378-147a-4d05-8f26-f5c6bf98750b; SPC_IA=1; _hjSession_868286=eyJpZCI6IjBlZDBiMzYxLWY2YmQtNGM4NS1iY2JkLTkyZTljODEwNmFjNCIsImMiOjE3MDkzNjA2MTQyNjksInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjoxLCJzcCI6MH0=; AMP_TOKEN=%24NOT_FOUND; _gid=GA1.2.1132431201.1709360614; _dc_gtm_UA-61914164-6=1; SPC_CLIENTID=RGN1Q3EyQ29jNjE0lmtiowcpxozhfzeo; SPC_EC=.VWhZYkhUZFVnTXlXZ2UwSJg0e6WTUyD5LupoVcjyI56kWA1cwqNi6Kkd2z60ru55xZosxoJVi2B58ipV/zYuW4AqbrwWFfxIli+SppdJWSceZclg4Rk3nqcrTZqL9b420Aij007M7+fqlemkFcY1osP8aopApNbfoYZnt86aQK1rOGaU/+iN1enlnUveIc62TDlzCNprdueLSVH5CnCNkk6/ijiGKg12Gsk1YLYwFRw=; SPC_ST=.VWhZYkhUZFVnTXlXZ2UwSJg0e6WTUyD5LupoVcjyI56kWA1cwqNi6Kkd2z60ru55xZosxoJVi2B58ipV/zYuW4AqbrwWFfxIli+SppdJWSceZclg4Rk3nqcrTZqL9b420Aij007M7+fqlemkFcY1osP8aopApNbfoYZnt86aQK1rOGaU/+iN1enlnUveIc62TDlzCNprdueLSVH5CnCNkk6/ijiGKg12Gsk1YLYwFRw=; SPC_U=868451354; SPC_R_T_ID=DRYP2xer2f3pFbwvJJcrWM2BduTeoaxdeRukwZPpAIbQOVeSAbJx9fm6vJp/Tz0LRFNtvjZI9umM"

cookie_pattern = re.compile(r'([^=]+)=([^;]+);?\s*')

cookies = cookie_pattern.findall(cookie_string)
driver = webdriver.Chrome(options=options)

driver.get("https://shopee.vn/")

for key, value in cookies:
    driver.add_cookie({'name': key, 'value': value})

driver.refresh()
