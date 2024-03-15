FROM jenkins/jenkins:lts
USER root
RUN apt-get update && \
	curl -sSL https://get.docker.com/ | sh
