$script = <<-SCRIPT
sudo apt-get update
cd /home/vagrant
su - vagrant
sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
export NVM_DIR="/home/vagrant/.nvm"
source ~/.nvm/nvm.sh
nvm install v16.14.2
SCRIPT

Vagrant.configure("2") do |config|
    config.vm.box = "ubuntu/focal64"
    config.vm.provision "docker" do |d|
        d.build_image "/vagrant"
#    config.vm.provision "shell",
#        inline: $script
    end
end