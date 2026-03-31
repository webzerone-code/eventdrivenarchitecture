Good Morning <br/>
to run the application <br/>
rename the .env.example to .env <br/>
docker-compose up -d <br/>

payload url testing<br/>

GET http://localhost:3000<br/>
Accept: application/json<br/>

###<br/>

POST http://localhost:3000<br/>
Accept: application/json<br/>
Content-Type: application/json<br/>
<br/>
{
"orderID": "ORD-2026-033",
"status": "PAID",
"customer": {
"name": "new John Doe",
"email": "john.doe@example.com",
"phone": "1234567890"
},
"products": [
{
"productName": "Double Cheeseburger",
"unitePrice": 12.50,
"quantity": 2,
"totalUnitPrice": 25.00
},
{
"productName": "Large Fries",
"unitePrice": 4.00,
"quantity": 1,
"totalUnitPrice": 4.00
},
{
"productName": "Chocolate Milkshake",
"unitePrice": 6.00,
"quantity": 1,
"totalUnitPrice": 6.00
}
],
"totalPrice": 35.00
}
<br/>
###############################<br/>
GET http://localhost:3000/69cbcb01c68d407d386f773f<br/>
Accept: application/json<br/>
Content-Type: application/json<br/>
<br/>
######################################<br/>
PATCH http://localhost:3000/69cc360c084faf85ea549488<br/>
Accept: application/json<br/>
Content-Type: application/json<br/>
<br/>
{
"status": "PAID",
"customer": {
"name": "new John Doe1234",
"email": "john.doe@example.com",
"phone": "1234567890"
},
"products": [
{
"productName": "Double Cheeseburger",
"unitePrice": 12.50,
"quantity": 2,
"totalUnitPrice": 25.00
},
{
"productName": "Large Fries",
"unitePrice": 4.00,
"quantity": 1,
"totalUnitPrice": 4.00
},
{
"productName": "Chocolate Milkshake",
"unitePrice": 6.00,
"quantity": 1,
"totalUnitPrice": 6.00
}
],
"totalPrice": 35.00
}

<br/>
#########################################<br/>
GET http://localhost:3000/reports/daily-sales<br/>
Accept: application/json<br/>
Content-Type: application/json<br/>
<br/>
############################################# search orders<br/>
GET http://localhost:3000/elastic/search?q=Large Fries<br/>
Accept: application/json<br/>
Content-Type: application/json<br/>