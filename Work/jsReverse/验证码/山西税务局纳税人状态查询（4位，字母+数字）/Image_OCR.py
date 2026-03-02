# -*- coding: utf-8 -*-
"""
@File    : Image_OCR.py
@Author  : Elliot Lin
@Date    : 2026/3/2 12:55
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 提供使用ddddocr识别验证码图片的功能
"""
import ddddocr
import os

def recognize_captcha(image_input):
    """
    使用ddddocr识别验证码图片

    Args:
        image_input (str or bytes): 验证码图片的路径 (str) 或 图片的二进制数据 (bytes)

    Returns:
        str: 识别出的文本
    """
    # 1. 创建ddddocr的实例
    ocr = ddddocr.DdddOcr()

    # 2. 判断输入类型并获取图片的二进制数据
    if isinstance(image_input, str):
        # 如果输入是字符串，则认为它是文件路径
        if not os.path.isfile(image_input):
            raise FileNotFoundError(f"文件未找到: {image_input}")
        with open(image_input, 'rb') as f:
            img_bytes = f.read()
    elif isinstance(image_input, bytes):
        # 如果输入是字节，则直接使用
        img_bytes = image_input
    else:
        raise TypeError(f"image_input 必须是 str (文件路径) 或 bytes (图片数据)，当前类型是: {type(image_input)}")

    # 3. 调用 ocr.classification 方法进行识别
    result = ocr.classification(img_bytes)

    return result


# --- 主程序 (用于测试) ---
if __name__ == "__main__":
    # 测试方式1: 通过文件路径识别
    captcha_image_path = "Captcha_99c83935.png" # 替换成你自己的验证码图片路径
    try:
        recognized_text_from_file = recognize_captcha(captcha_image_path)
        print(f"从文件识别的结果: {recognized_text_from_file}")
    except FileNotFoundError:
        print(f"错误：找不到文件 {captcha_image_path}")
    except Exception as e:
        print(f"从文件识别过程中发生错误: {e}")

    # 测试方式2: 通过二进制数据识别
    try:
        with open(captcha_image_path, 'rb') as f:
            image_data_bytes = f.read()
        recognized_text_from_bytes = recognize_captcha(image_data_bytes)
        print(f"从二进制数据识别的结果: {recognized_text_from_bytes}")
    except FileNotFoundError:
        print(f"错误：找不到文件 {captcha_image_path} (用于二进制测试)")
    except Exception as e:
        print(f"从二进制数据识别过程中发生错误: {e}")