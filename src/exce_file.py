import os
from datetime import datetime
import xlrd
import json

data_list = []

def Lop_Hoc_Phan(nName, sheet):
    parts = nName.split('-')
    name = parts[0].strip()
    lophp = ''
    qt_part = next((part for part in parts if 'QT' in part), None)
    if qt_part:
        qt_index = qt_part.index('QT')
        lophp = qt_part[qt_index:]
        lophp = lophp[:lophp.index(')')]
    return name, lophp


def Tiet_Hoc(nName, sheet):
    if nName == '1->3':
        return 1
    if nName == '4->6':
        return 2
    if nName == '7->9':
        return 3
    if nName == '10->12':
        return 4


def exce_time(date_str):
    date_str = date_str.split("-")
    if len(date_str) == 1:
        return None, None
    start_date_str = date_str[0]
    end_date_str = date_str[1]
    start_date = datetime.strptime(start_date_str.strip(), "%d/%m")
    end_date = datetime.strptime(end_date_str.strip(), "%d/%m/%Y")
    year = end_date.year
    if start_date.month > end_date.month:
        year -= 1
    start_date = start_date.replace(year=year)
    return start_date, end_date


def exce_info(sheet):
    lop_hoc_phan_1 = ''
    tenlop_1 = ''
    start_date = ''
    end_date = ''
    for row in range(4, sheet.nrows):
        tenlop, lophocphan = Lop_Hoc_Phan(sheet.cell_value(row, 3), sheet)
        if lophocphan == '':
            lophocphan = lop_hoc_phan_1
            tenlop = tenlop_1
        else:
            lop_hoc_phan_1 = lophocphan
            tenlop_1 = tenlop

        thu = sheet.cell_value(row, 9)

        tiet_hoc = Tiet_Hoc(sheet.cell_value(row, 10), sheet)

        phonghoc = sheet.cell_value(row, 11)

        start_time, end_time = exce_time(sheet.cell_value(row, 12))
        if start_time is not None:
            start_date = start_time
        else:
            start_time = start_date
        if end_time is not None:
            end_date = end_time
        else:
            end_time = end_date

        start_time = start_time.strftime("%Y-%m-%d %H:%M:%S")
        end_time = end_time.strftime("%Y-%m-%d %H:%M:%S")
        start_time = str(start_time)
        end_time = str(end_time)

        if thu == '':
            continue
        data_list.append({
            'LopHocPhan': lophocphan,
            'TenLop': tenlop,
            'Thu': thu,
            'Ca': tiet_hoc,
            'PhongHoc': phonghoc,
            'ThoiGianBatDau': start_time,
            'ThoiGianKetThuc': end_time
        })


def exce_student(nName):
    workbook = xlrd.open_workbook(nName)
    sheet = workbook.sheet_by_index(0)
    exce_info(sheet)
    with open('upload/data.json', 'w', encoding='utf8') as json_file:
        json.dump(data_list, json_file, ensure_ascii=False)
    os.remove(nName)