FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
# yw)T*L5OKV$-ApnH=uv4TO6*2hk!ZGB1
# Install dependencies
RUN apt-get update && apt-get install -y \
    wget \
    python3 \
    python3-pip \
    libglu1-mesa \
    libpulse0 \
    libnss3 \
    libx11-6 \
    libxrender1 \
    libxt6 \
    libxext6 \
    libsm6 \
    libice6 \
    && rm -rf /var/lib/apt/lists/*

# Download Slicer (Linux version)
WORKDIR /opt

RUN wget https://download.slicer.org/bitstream/64-linux/slicer-5.6.2-linux-amd64.tar.gz \
    -O slicer.tar.gz && \
    tar -xvzf slicer.tar.gz && \
    rm slicer.tar.gz

# Rename folder for convenience
RUN mv Slicer-* Slicer

ENV SLICER_HOME=/opt/Slicer
ENV PATH="$SLICER_HOME:$PATH"

# Copy your script
WORKDIR /app
COPY run.py .

# Default command: run slicer headless with python
CMD ["/opt/Slicer/Slicer", "--no-main-window", "--python-script", "run.py"]