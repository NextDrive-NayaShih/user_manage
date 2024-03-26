FROM node:latest

# 设置工作目录
WORKDIR /usr/src/app

# 将 package.json 和 package-lock.json 复制到工作目录
COPY package*.json .

# 安装依赖
RUN npm install

# 将项目文件复制到工作目录
COPY . .

# 暴露端口
EXPOSE 3000

# 启动应用程序
CMD ["node", "index.js"]
