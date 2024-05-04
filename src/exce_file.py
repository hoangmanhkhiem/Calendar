import os
from os import devnull
from datetime import datetime
import xlrd
import json

data_list = []


def Tiet_Hoc(nName):
    if nName == '1,2,3':
        return 1
    if nName == '4,5,6':
        return 2
    if nName == '7,8,9':
        return 3
    if nName == '10,11,12':
        return 4


def exce_time(date_str):
    date_str = date_str.replace('Từ', '')
    date_str = date_str.replace(':', '')
    date_str = date_str.split('đến')
    if len(date_str) == 1:
        return date_str
    start_date_str = date_str[0]
    end_date_str = date_str[1]
    start_date = datetime.strptime(start_date_str.strip(), "%d/%m/%Y")
    end_date = datetime.strptime(end_date_str.strip(), "%d/%m/%Y")
    start_date = start_date.strftime("%Y-%m-%d %H:%M:%S")
    end_date = end_date.strftime("%Y-%m-%d %H:%M:%S")
    start_date = str(start_date)
    end_date = str(end_date)
    return start_date, end_date





def exce_info(sheet):
    start_date = ''
    end_date = ''
    for row in range(10, sheet.nrows):
        ten_mon_hoc = sheet.cell_value(row, 3)
        lop_hoc_phan = sheet.cell_value(row, 5)

        if ten_mon_hoc == '' and lop_hoc_phan == '':
            break
        if ten_mon_hoc == '':
            ten_mon_hoc = ten_mon_hoc_1
        else:
            ten_mon_hoc_1 = ten_mon_hoc

        thong_tin_ngay_diadiem = sheet.cell_value(row, 7)

        nName = thong_tin_ngay_diadiem.split("\n")
        for i in range(0, len(nName)):
            if 'Từ' in nName[i]:
                start_date,end_date = exce_time(nName[i])
            else:
                    thong_tin = nName[i].split(" ")
                    thu = thong_tin[2]
                    tiet_hoc = thong_tin[4]
                    tiet_hoc = Tiet_Hoc(tiet_hoc)
                    if thong_tin[6] == 'Ngoài':
                        phonghoc = thong_tin[6] + " " + thong_tin[7] + " " + thong_tin[8]
                    elif thong_tin[6] == 'Phòng':
                        phonghoc = 'Online'
                    else:
                        phonghoc = thong_tin[6]
                    data_list.append({
                        'LopHocPhan': lop_hoc_phan,
                        'TenLop': ten_mon_hoc,
                        'Thu': thu,
                        'Ca': tiet_hoc,
                        'PhongHoc': phonghoc,
                        'ThoiGianBatDau': start_date,
                        'ThoiGianKetThuc': end_date
                    })

def exce_student(nName):
    workbook = xlrd.open_workbook(nName,logfile=open(devnull, 'w'))
    sheet = workbook.sheet_by_index(0)
    exce_info(sheet)
    with open('upload/data.json', 'w', encoding='utf8') as json_file:
        json.dump(data_list, json_file, ensure_ascii=False)
    os.remove(nName)
