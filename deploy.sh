sudo kill -9 $(sudo lsof -t -i:443)
sudo ojet build --release && sudo nohup ojet serve web --server-port=443 --release &