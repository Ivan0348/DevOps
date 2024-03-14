# DEVOPS - Week6

Practicum week 6

Starten met monitoring: Prometheus en Grafana, door gebruik te maken van een Chat App.

## Enable metrics endpoint in Chat API

Create `Dockerfile` in chatapi folder.
With the following contents:

```
FROM node:12-alpine

WORKDIR /usr/src/app

COPY . .
RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]
```

<b>Then install prometheus npm packages</b><br/>
`npm install prom-client --save`<br/>
`npm install express-prom-bundle --save`<br/>
`npm install --save-dev nodemon`<br/><br/>

Then add the following line of code in `app.js`<br/><br/>

```
...

const promBundle = require('express-prom-bundle');
const metricsMiddleware = promBundle({
	includePath: true,
	includeStatusCode: true,
	normalizePath: true,
	promClient: {
		collectDefaultMetrics: {}
	}
});

... 
app.use(express.static(path.join(__dirname, 'public')));
...

app.use(metricsMiddleware); // enable Metrics middleware
```

<br/><br/>

Modify `package.json` file and add the following line to `scripts`:
<code>
"start.dev": "nodemon ./bin/www"
</code>
<br/><br/>

Create an api in `users.js` which should demonstrate slowness.<br/>

```
router.get('/slow', function(req, res, next) {
  setTimeout(() => {
    res.send('Slowly respond with a resource');
  }, 3000); 
});
```

Now you can run: `npm run start.dev` to test the results at url: `http://localhost:3000/metrics`
<br></br>
<b>Lets trigger 2 Http requests to generate some metrics</b><br></br>
`http://localhost:3000/users` and `http://localhost:3000/users/slow` (to simulate slowness)

And check `http://localhost:3000/metrics` if we can see the new metrics.

<br/>

## Enable client connection metrics using a Gauge

Modify contents of `socket-api.js`.

```
const client = require('prom-client');
const gauge = new client.Gauge({ name: 'number_of_clients', help: 'Some metrics about numer of connected chat users'});
```

<br/><br/>
Now during connecting and disconnection use the code below:

```
gauge.inc(1);  // When a connection is established

gauge.dec(1); // When a user is disconnected.
````

<br/>

<b>Lets test it</b>
`npm run start.dev` and creating multiple instances of localhost:3000 in your browser.<br/>
This should create a new user connection each time.
Results can be found at `http://localhost:3000/metrics`. See topic `number_of_clients` in response

## Enable Prometheus

Create 2 prometheus configuration files in `/prometheus` folder. <br/>
`alert.yml` and `prometheus.yml`<br/><br/>

Contents of `alert.yml`<br/>

```
groups:
  - name: DemoAlerts
    rules:
      - alert: "On api down"
        expr: up{job="api"} < 1
        for: 30s
      - alert: "API Slow"
        expr: http_request_duration_seconds_sum{job="api", path="/users/slow"} > 2
        for: 20s
```

<br></br>
Contents of `/prometheus/prometheus.yml`<br/>

```
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  scrape_timeout: 10s

rule_files:
  - alert.yml

scrape_configs:
  - job_name: "api"
    static_configs:
      - targets: ["api:5000"]

```

<b>Create docker compose file</b><br/>
`docker-compose.yml` file with the following contents:

```
version: '3.9'

services:
  api:
    build: ./chatapi
    ports:
      - 5000:5000
    environment:
      - PORT=5000
    volumes:
      - ./chatapi:/usr/src/app
      - /usr/src/app/node_modules

  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus:/etc/prometheus
      - prometheus-data:/prometheus
    ports:
      - 9090:9090
    command: --web.enable-lifecycle --config.file=/etc/prometheus/prometheus.yml

volumes:
  prometheus-data:
```

Lets start our solution. Run command from root src directory: `docker-compose up -d`

The following command should bring the API down: `docker container stop devops-week6-api-1`<br/>
Then the alerting in prometheus should fire after 30seconds as configured

## Enable Grafana

Create the following files below:
`grafana/config.ini`

```
[paths]
provisioning = /etc/grafana/provisioning

[server]
enable_gzip = true

[users]
default_theme = light
```

`grafana/provisioning/dashboards/all.yml`

```
- name: 'default'
  org_id: 1
  folder: ''
  type: 'file'
  options: 
    folder: '/var/lib/grafana/dashboards'

```

`grafana/provisioning/datasources/all.yml`

```
datasources:
  - name: 'Prometheus'
    type: 'prometheus'
    access: 'proxy'
    org_id: 1
    url: 'http://prometheus:9090'
    is_default: true
    version: 1
    editable: true
```

`grafana/Dockerfile`

```
FROM grafana/grafana:latest

ADD ./provisioning /etc/grafana/provisioning
ADD ./config.ini /etc/grafana/config.ini
ADD ./dashboards /var/lib/grafana/dashboards
```

Copy `_tmp/grafana_dashboard.json` to `grafana/dashboards/grafana_dashboard.json`. Which is actually a copy of Grafana
template id: 11159 imported from Grafana UI.

<br></br>
Now modify the `Docker-compose.yml` file and add the following service:

```
  grafana:
    build: ./grafana
    ports:
      - 3000:3000
```

Lets start our solution. Run command from root src directory: `docker-compose up -d`

Grafana should be accessible on: http://localhost:3000