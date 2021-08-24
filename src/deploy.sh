sudo kill -9 $(sudo lsof -t -i:443)
sudo ojet build --release && sudo nohup ojet serve --server-port=443 --release &