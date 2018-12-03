Online Auction
==============

An Auction Website for Web Programming Language Course.

Colloborators:
--------------
Chandra Kiran
Shubham Kothari
Hitesh Gupta T R

READ ME
=======

Invoke "npm install" under both back-end and Angular(Under front-end) folders to
install packages before starting server.

Requirements
------------

Install Redis server for Caching capabilities and ensure running.
Install RabbitMQ for Queues (Micro-service) and ensure running.


when using development setup
----------------------------
Use "npm start" command to start both the servers.

self signed certificates are to be added to browser exceptions.
-   open https://localhost:3000/api/user/login and add exception to browser.
-   open https://localhost:4200/login and add exception to browser.

Features | Node server | Angular server
--- | --- | ---
Caching | done | yet to
Compression | done | yet to
HTTPS | done | dev server only

HTTPS:
------
Certificates part of the repo are self signed and are configured for localhost.