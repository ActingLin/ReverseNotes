# -*- coding: utf-8 -*-
"""
@File    : k-means-final_1.py.py
@Author  : Elliot Lin
@Date    : 2026/3/11 20:14
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import pandas as pd
import csv
import gensim
from pprint import pprint
from collections import defaultdict
import numpy as np
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
from adjustText import adjust_text  # 确保已安装: pip install adjusttext


def load_stopwords(filepath):
    """从文件加载停用词表"""
    try:
        df = pd.read_csv(filepath, header=None, names=['word'], quoting=csv.QUOTE_NONE, delimiter="\t")
        return set(df['word'].tolist())
    except FileNotFoundError:
        print(f"警告: 停用词文件 '{filepath}' 未找到，将不使用停用词过滤。")
        return set()


def read_column_from_csv(filepath, column_name):
    """从CSV文件中高效地读取指定列的所有数据"""
    data = []
    with open(filepath, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            data.append(row.get(column_name, '').strip())
    return data


def preprocess_data(raw_data, stop_words_set):
    """对原始数据进行预处理，形成Word2Vec所需的格式"""
    processed_sentences = []
    for text in raw_data:
        # 假设'apps'列的单元格本身就是单个词
        # 如果是短语，这里需要先进行jieba分词
        word_list = [text] if text else []

        # 过滤掉停用词和长度小于等于1的词
        filtered_words = [word for word in word_list if word and word not in stop_words_set and len(word) > 1]

        if filtered_words:
            processed_sentences.append(filtered_words)

    return processed_sentences


def train_word2vec_model(sentences, min_count=100, vector_size=100, window=5):
    """训练Word2Vec模型"""
    if not sentences:
        raise ValueError("没有足够的数据来训练Word2Vec模型。请检查输入数据和预处理步骤。")

    print(f"正在使用 {len(sentences)} 个句子训练 Word2Vec 模型...")
    model = gensim.models.Word2Vec(
        sentences=sentences,
        vector_size=vector_size,
        window=window,
        min_count=min_count,
        workers=4,
        sg=0  # 0 for CBOW, 1 for Skip-gram
    )
    return model


def perform_pca_and_clustering(vectors, words, n_clusters=3):
    """对词向量进行PCA降维和K-Means聚类"""
    if len(words) < 2:
        raise ValueError(f"可用词汇数量 ({len(words)}) 少于聚类所需的最小数量。请降低 min_count 或检查数据。")

    print(f"正在对 {len(words)} 个词的向量进行PCA降维和K-Means聚类...")

    # PCA降维
    pca = PCA(n_components=2)
    result_2d = pca.fit_transform(vectors)

    # K-Means聚类
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    cluster_labels = kmeans.fit_predict(result_2d)

    return result_2d, cluster_labels


def visualize_clusters(reduced_vectors, labels, words, frequencies):
    """可视化聚类结果"""
    print("正在绘制聚类结果图...")

    plt.rcParams['font.sans-serif'] = ['SimHei']  # 用来正常显示中文标签
    plt.rcParams['axes.unicode_minus'] = False  # 用来正常显示负号

    fig, ax = plt.subplots(figsize=(12, 8))

    scatter = ax.scatter(reduced_vectors[:, 0], reduced_vectors[:, 1], c=labels, cmap='viridis', alpha=0.6)

    # 添加词标签
    texts = []
    for i, word in enumerate(words):
        t = ax.text(reduced_vectors[i, 0], reduced_vectors[i, 1], word, fontsize=10)
        texts.append(t)

    # 调整标签位置以减少重叠
    adjust_text(texts, arrowprops=dict(arrowstyle='->', color='red', lw=0.5))

    plt.title('App词向量聚类结果')
    plt.xlabel('PCA-Component 1')
    plt.ylabel('PCA-Component 2')
    plt.colorbar(scatter)
    plt.show()


def main():
    """主函数，协调所有步骤"""
    # --- 配置 ---
    # filename = "data_f1000.csv"
    filename = r"D:\LDA-anaconda\K-MEANS-PCA\data_0.csv"
    stopword_file = "stop_words_ch.txt"
    target_column = 'app'
    MIN_COUNT = 10  # 调整此参数以适应您的数据
    N_CLUSTERS = 3  # 聚类数量

    try:
        # --- 步骤 1: 加载数据 ---
        print("=== 步骤 1: 加载数据 ===")
        raw_data = read_column_from_csv(filename, target_column)
        if not raw_data:
            raise ValueError("从CSV文件中未读取到任何数据。请检查文件路径和列名。")

        # --- 步骤 2: 加载停用词 ---
        print("=== 步骤 2: 加载停用词 ===")
        stop_words_set = load_stopwords(stopword_file)

        # --- 步骤 3: 数据预处理 ---
        print("=== 步骤 3: 数据预处理 ===")
        processed_sentences = preprocess_data(raw_data, stop_words_set)

        # --- 步骤 4: 训练 Word2Vec 模型 ---
        print("=== 步骤 4: 训练 Word2Vec 模型 ===")
        model = train_word2vec_model(processed_sentences, min_count=MIN_COUNT)

        # --- 步骤 5: 获取词汇和词向量 ---
        print("=== 步骤 5: 获取词汇和词向量 ===")
        words = list(model.wv.key_to_index.keys())
        if not words:
            raise ValueError("模型训练后没有可用的词汇。请检查 min_count 参数是否过高。")

        vectors = model.wv[words]  # 获取所有词汇的向量矩阵
        print(f"模型共学习到 {len(words)} 个词汇。")

        # --- 步骤 6: 计算词频 ---
        print("=== 步骤 6: 计算词频 ===")
        frequency = defaultdict(int)
        for sentence in processed_sentences:
            for token in sentence:
                if token in words:  # 只统计最终进入模型的词
                    frequency[token] += 1
        words_frequency = [frequency[word] for word in words]
        word_frequency_df = pd.DataFrame({"单词": words, "频率": words_frequency})
        print(word_frequency_df)

        # --- 步骤 7: PCA降维与K-Means聚类 ---
        print("=== 步骤 7: PCA降维与K-Means聚类 ===")
        result_2d, cluster_labels = perform_pca_and_clustering(vectors, words, n_clusters=N_CLUSTERS)

        # --- 步骤 8: 可视化 ---
        print("=== 步骤 8: 可视化 ===")
        visualize_clusters(result_2d, cluster_labels, words, words_frequency)

    except Exception as e:
        print(f"\n脚本执行过程中发生错误: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()