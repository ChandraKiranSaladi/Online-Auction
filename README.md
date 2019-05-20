Online Auction
==============
A responsive web site and scalable web application based on the Service Oriented Architecture (SOA) for **Auction**

### Brief Description:


* The “Bid Processing” Web Service is asynchronous. Its functionality should be supported and implemented using a queue. All the requests for the bid should be added to queue
* Bidders will be able to view the auction schedule at least for one month and different items available for bidding during a particular date
* A specified number of items will be auctioned by your auction house website on a
first-come-first-served basis
* Each item will be given an amount of time to be on the auction board. During that
time slot, only ONE item will be available for bidding on the auction board

**For more details read Project Description.pdf**

#### Highlights

  * Microservice
  * Web services
  * https
  * Compression
  * Queues ( RabbitMQ )
  * Caching ( Redis-Cli )

## Technical Dependencies

Software | links 
--- | ---
NodeJS  | https://nodejs.org/en/
MongoDB | https://www.mongodb.com/download-center/community
Angular7 | If NodeJS is installed your are good
ExpressJS |        "
Erlang    | https://www.erlang.org/downloads
RabbitMQ  | https://www.rabbitmq.com/install-windows.html
Windows Subsystem for Linux ( Ubuntu 18.04 ) | https://winaero.com/blog/enable-wsl-windows-10-fall-creators-update/
Redis-Cli (Ubuntu WSL ): | ``` $ sudo apt install redis-server ```
Encryption | TLS/SSL self signed certificates, exists with the project. if you want generate or interested to know more about 'em. See in the **openssl** section<br> https://medium.com/the-new-control-plane/generating-self-signed-certificates-on-windows-7812a600c2d8
Windows | Operating System
  
  Back-end, front-end and microservice source code is present in each respective folder with the same name

## Execution Instructions

1) Installing npm packages in
   * back-end folder
   * front-end/Angular folder
   * microservice folder
    ```cmd
    $ npm install 
    ``` 
2) In WSL Ubuntu, This will start the cache server. 
   ```shell
   $ sudo service redis-server start 
   $ redis-cli monitor
   ```
3) Open a powershell terminal. Go inside MongoDB Server folder in Program files and give the path for the folder where you want your database to reside. Then Execute the following command. Here I give my location. After executing this statement mongodb starts its service and listens to connections at localhost:27017 port. 
   ```cmd
   C:\ > cd C:\Program Files\MongoDB\Server\4.0\bin
   C:\Program Files\MongoDB\Server\4.0\bin > mongod.exe --dbpath="C:\Users\Ck\Downloads\data\db"
   ```
4) Open a different powershell terminal. Enable rabbitMQ management console: . Under C:\Program Files\RabbitMQ Server\rabbitmq_server-3.7.9\sbin execute ".\rabbitmq-plugins.bat enable rabbitmq_management". 
   * THis will start Queue server
   ```cmd
   > cd C:\Program Files\RabbitMQ Server\rabbitmq_server-3.7.9\sbin
   \sbin > ./rabbitmq-plugins.bat enable rabbitmq_management
   ```
5) Executing this command in
   * back-end folder
   * front-end/Angular folder
   * microservice folder
    ```cmd
    $ npm run start 
    ``` 

npm run start uses Development setup
----------------------------


self signed certificates are to be added to browser exceptions.
-   open https://localhost:3000/api/user/login and add exception to browser.
-   open https://localhost:4200/login and add exception to browser.

Features | Node server | Angular server
--- | --- | ---
Caching | done | yet to
Compression | done | yet to
HTTPS | done | dev server only

### HTTPS:

    Certificates part of the repo are self signed and are configured for localhost.

### Queues
* http://localhost:15672 in browser username: guest & password: guest
* Open Queues page to check the queues.
  
### Colloborators:

* Hitesh Gupta T R
* Chandra Kiran Saladi
* Shubham Kothari