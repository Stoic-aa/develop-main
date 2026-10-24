import os
from PIL import Image
import argparse

def convert_single_png_to_webp(input_file, quality=80, lossless=False):
    """
    将单个PNG图片转换为WebP格式，输出到当前目录
    
    参数:
        input_file (str): 输入PNG图片文件路径
        quality (int): WebP压缩质量 (0-100), 默认80
        lossless (bool): 是否使用无损压缩, 默认False
    """
    # 检查输入文件是否存在
    if not os.path.exists(input_file):
        print(f"错误：输入文件 {input_file} 不存在")
        return False
    
    # 检查是否是PNG文件
    if not input_file.lower().endswith('.png'):
        print("错误：输入文件必须是PNG格式")
        return False
    
    # 获取当前目录作为输出目录
    output_dir = os.getcwd()
    # 生成输出文件名（和输入文件同名，扩展名改为webp）
    output_filename = os.path.splitext(os.path.basename(input_file))[0] + '.webp'
    output_path = os.path.join(output_dir, output_filename)
    
    try:
        # 打开PNG图片
        with Image.open(input_file) as img:
            # 保存为WebP格式
            img.save(output_path, 'WEBP', quality=quality, lossless=lossless)
            print(f"转换成功!")
            print(f"输入文件: {input_file}")
            print(f"输出文件: {output_path}")
            return True
    except Exception as e:
        print(f"转换失败: {str(e)}")
        return False

if __name__ == "__main__":
    # 创建命令行参数解析器
    parser = argparse.ArgumentParser(description='将单个PNG图片转换为WebP格式，输出到当前目录')
    parser.add_argument('input_file', help='输入PNG图片文件路径')
    parser.add_argument('--quality', '-q', type=int, default=80, help='WebP压缩质量 (0-100), 默认80')
    parser.add_argument('--lossless', '-l', action='store_true', help='启用无损压缩')
    
    args = parser.parse_args()
    
    # 执行转换
    convert_single_png_to_webp(args.input_file, args.quality, args.lossless)