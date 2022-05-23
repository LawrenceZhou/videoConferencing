
# Video Conferencing - Dyadic Version ( Full-Stack App Built with PHP, NPM, Webpack, Reactjs, and SkyWay)

## About
Project targeting to build a simple dyadic video conferencing system using Javascript.


## Instructions
Below are the installing and running procedues

### Installing
Requirement: node, npm, go, and mysql (**node v12.13.0**, **npm v6.12.0**, **Go v1.16.5**, **MySQL v5.7.33-0ubuntu0.16.04.1**)
  
1. Install Node and Npm.

Install curl.
  
`apt-get install curl`
      
Sometimes, the error below may occur when building it in a virtual machine:
      
E: Could not get lock /var/lib/dpkg/lock-frontend - open (11: Resource temporarily unavailable)
      
E: Unable to acquire the dpkg frontend lock (/var/lib/dpkg/lock-frontend), is another process using it?
  
If so, run the following command: 

`rm /var/lib/apt/lists/lock`

Then install node and npm.
`apt-get update`

`apt-get -y upgrade`

`apt-get -y install dirmngr apt-transport-https lsb-release ca-certificates`
 
`curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -`

`apt-get install nodejs`

`npm install -g npm@6.12.0`

`npm install -g n`

`n 12.13.0`

It would need to start a new shell window to see the version change.

2. Install Git.

`apt-get install git`

3. Clone the project.

`git clone https://github.com/LawrenceZhou/labelingInterface.git labelingInterface`

4. Enter the directary *templates/static/* and run the command `npm install`. (Download and install all the dependencies listed in *package.json*.)

5. In the static directory, build the front end code with the command `npm run build`

6. Install Go and Gin

Download Go v1.16.5 from the site: https://golang.org/doc/install

`wget https://go.dev/dl/go1.16.5.linux-amd64.tar.gz`

Extract the archive you downloaded into /usr/local, creating a Go tree in /usr/local/go.

`rm -rf /usr/local/go && tar -C /usr/local -xzf go1.16.5.linux-amd64.tar.gz`

Add the following line to /etc/profile (for a system-wide installation): 

`export PATH=$PATH:/usr/local/go/bin`

Start a new shell to check the Go installed:
`go version`

Install Gin.
`go get -u github.com/gin-gonic/gin`

7. Install MySQL

`apt-get update`

`apt-get install mysql-server`

Use `mysql_secure_installation` for mysql configuration.

Use `systemctl status mysql.service` or `mysqladmin -p -u root version` to check mysql connection and status.

8. Install PhPAdmin for mysql visualization.

`apt-get update`

`apt-get install phpmyadmin php-mbstring php-gettext`

For the server selection, choose apache2.

Select yes when asked whether to use dbconfig-common to set up the database.

Enable the PHP mbstring extensions:

`phpenmod mbstring`

Enable the PHP mcrypt extensions:

`sudo add-apt-repository ppa:ondrej/php`

`sudo apt-get install php7.2-mcrypt`

`phpenmod mcrypt`

Restart Apache for changes to be recognized:

`systemctl restart apache2`

Change default password.

`sudo mysql -u root`

`ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'test';`

Do phpmyadmin proxy reverse.

Create new VirtualHost configuration file.

`sudo nano /etc/apache2/sites-available/phpmyadmin.conf`

Add the content to it.

`Listen 99`

`<VirtualHost *:99>`

`    ServerName localhost`

`    <Directory /usr/share/phpmyadmin>`

`    	AllowOverride None`

`       Require all granted`

`    </Directory>`

`    DocumentRoot /usr/share/phpmyadmin`

`    Include /etc/phpmyadmin/apache.conf`

`    ErrorLog ${APACHE_LOG_DIR}/phpmyadmin.error.log`

`    CustomLog ${APACHE_LOG_DIR}/phpmyadmin.access.log combined`

`</VirtualHost>`

Switch Apache's configuration and restart it.

`sudo a2disconf phpmyadmin`

`sudo a2ensite phpmyadmin`

`sudo systemctl restart apache2.service`

Edit port and ip config.

`sudo ufw allow 99/tcp`

`sudo iptables -A INPUT -p tcp -m tcp --dport 99 -j ACCEPT`

DONOT FORGET TO CHANGE AWS EC2 CONFIG!!!!

Go to `http://52.38.121.191:99` for checking the mysql(Username: root, Password:test).

There can be an error: `phpmyadmin - count(): Parameter must be an array or an object that implements Countable`

Do this:

`sudo sed -i "s/|\s*\((count(\$analyzed_sql_results\['select_expr'\]\)/| (\1)/g" /usr/share/phpmyadmin/libraries/sql.lib.php`

9. Proxy Reverse

Enable some modules using a2enmod.

`sudo a2enmod proxy`

`sudo a2enmod proxy_http`

`sudo a2enmod proxy_ajp`

`sudo a2enmod rewrite`

`sudo a2enmod deflate`

`sudo a2enmod headers`

`sudo a2enmod proxy_balancer`

`sudo a2enmod proxy_connect`

`sudo a2enmod proxy_html`

Edit the config file.

`sudo nano /etc/apache2/sites-enabled/000-default.conf`

Append this code below inside `<VirtualHost *:80>`.

`<VirtualHost *:80>`

`#many code`

`#some comments`

`        #for golang`

`        ProxyPreserveHost On`

`        ServerName label.yijunzhou.xyz`

`        ServerAlias label`

`        ProxyPass / http://127.0.0.1:8080/`

`        ProxyPassReverse / http://127.0.0.1:8080/`

`        <Proxy *>`

`        	Order deny,allow`

`        	Allow from all`

`    	</Proxy>`

`</VirtualHost>`

Save it and restart the apache2 by 

`sudo systemctl restart apache2`

DONOT FORGET TO CHANGE AWS EC2 CONFIG!!!!

### Running

1. Go to the `server/` directory create database and tables: ` go run *.go -mode=init_database -database_name=label_task_schema` 

2. For debugging, start the server with `go run *.go -mode=server -database_name=label_task_schema`
	
   There can be an error: `MySQL Error: : 'Access denied for user 'root'@'localhost'`,

   Do this if you didn't do it in Step 8:

   `sudo mysql -u root`

   `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'test';`

3. For deployment, build the executive file:
   `go build -o server`

   Forever run it:
   `nohup ./server &`

   Kill it by:
   `killall ./server`

4. If all is working correctly, check the address http://label.yijunzhou.xyz/ which you can open in your  browser and see the application running.
