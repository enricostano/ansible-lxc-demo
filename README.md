## Using LXC and Ansible to build isolated development environments
This is the content from my talk at [Ansible Barcelona meetup](http://www.meetup.com/Ansible-Barcelona/events/225255072) on 15th October 2015.

### LXC Setup
1. Install [LXC](https://linuxcontainers.org/lxc/introduction/) tools for your GNU/Linux distribution and setup network configuration (e.g. [Arch Linux](https://wiki.archlinux.org/index.php/Linux_Containers) or [Ubuntu](https://help.ubuntu.com/lts/serverguide/lxc.html))
2. Clone this repo:

        > git clone git@github:enricostano/ansible-lxc-demo.git

3. Modify the shared filesystem part of the `provisioning/ubuntu.custom.conf` file to reflect the actual path of your directories
4. From the `provisioning` directory run:

        > sudo lxc-create --name project_1_dev -f ubuntu.custom.conf -t /usr/share/lxc/templates/lxc-ubuntu -- --release trusty
        > sudo lxc-start --name project_1_dev
        > sudo lxc-ls --fancy

    The last command should show you the list of existing LXC containers in your machine, something like the following:

        NAME           STATE    IPV4        IPV6  GROUPS  AUTOSTART
        -----------------------------------------------------------
        project_1_dev  RUNNING  10.0.3.106  -     -       NO

    Fix your network configuration if you don't get an IP address for your container.
5. Copy your SSH key into the default container user:

        > ssh-copy-id ubuntu@10.0.3.106

### Ansible setup
1. Install [Ansible](http://docs.ansible.com/ansible/intro_installation.html) for your GNU/Linux distribution
2. Add the container IP to the list of Ansible's hosts:

        # /etc/ansible/hosts
        [development]
        10.0.3.106

3. Enter through SSH into the container:

        > ssh ubuntu@10.0.3.106

4. From inside the container install Ansible's dependency Python 2.7 (remember that the default ubuntu password is `ubuntu`):

        > sudo apt-get install python2.7
        > sudo ln -s /usr/bin/python2.7 /usr/bin/python

5. Exit the container using CTRL^D and run the Ansible playbook from the `provisioning` directory. It will ask for the ubuntu sudo password:

        > ansible-playbook development.yml

### Backend application setup (Ruby on Rails)
1. Enter through SSH into the container:

        > ssh ubuntu@10.0.3.106

2. Enter the `backend` directory and install the application dependencies:

        > bundle install

3. Run the application:

        > bundle exec rails s --binding 10.0.3.106

4. Open a browser and visit the following URL:

        10.0.3.106:3000

### Frontend application setup (Express.js)
1. Enter through SSH into the container:

        > ssh ubuntu@10.0.3.106

2. Enter the `frontend` directory and install the application dependencies:

        > npm install

3. Run the application:

        > node app.js

4. Open a browser and visit the following URL:

        10.0.3.106:8000
