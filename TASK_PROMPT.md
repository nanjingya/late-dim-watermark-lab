数据组催得挺紧：流事件对维表老对不齐，尤其 watermark 过了之后迟到维表还在改。仓库里有个半成品，你把它补齐到 npm test 全过。别碰 Docker。

目标：
1) 打开 index.html（npm start 或 python3 -m http.server 8793 --directory .），左结果右控制，成功时 #status=ready。
2) src/watermark.js：根据 lateness 推进 event-time watermark；allow(ts) / isLate(ts) 语义要和测试一致。
3) src/dimStore.js：维表按 key 存版本；applyUpdate(key,value,ts)；lookup(key,ts) 取 as-of；迟到更新要能标记出来。
4) src/joinEngine.js：先按 watermark 吃 events，再处理迟到维表修正；#stats 至少 joined / lateDimFixes / watermark。
5) fixtures 用 fixtures/events.jsonl + fixtures/dim.jsonl；UI 能 Load / Run / Export。
6) 原生 ESM，别改弱测试。分多次短命令写文件，写完就跑 npm test，红了接着修到绿。
