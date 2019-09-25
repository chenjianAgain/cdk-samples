FROM alpine:latest

RUN \
	mkdir -p /aws && \
	apk -Uuv add groff less python3 bash && \
	pip3 install awscli && \
	rm /var/cache/apk/*

COPY entrypoint.sh /aws

WORKDIR /aws

ENTRYPOINT ["./entrypoint.sh"]
