FROM prom/prometheus

WORKDIR /etc/prometheus

# Copy the Prometheus configuration file into the container
COPY prometheus.yml .
COPY alert.yml .

# Expose the Prometheus port
EXPOSE 9090

# Start Prometheus
CMD [ "/bin/prometheus", "--config.file=/etc/prometheus/prometheus.yml" ]