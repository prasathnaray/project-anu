FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV SLICER_HOME=/opt/Slicer
ENV PATH="${SLICER_HOME}:${PATH}"

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libfontconfig1 \
    libfreetype6 \
    libegl1 \
    libgbm1 \
    libglib2.0-0 \
    libglu1-mesa \
    libgtk-3-0 \
    libice6 \
    libnss3 \
    libpcre2-16-0 \
    libpulse0 \
    libpulse-mainloop-glib0 \
    libsm6 \
    libx11-6 \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxft2 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxt6 \
    libxtst6 \
    libxcb-icccm4 \
    libxcb-image0 \
    libxcb-keysyms1 \
    libxcb-render-util0 \
    libxcb-shape0 \
    libxcb-cursor0 \
    libxcb-xinput0 \
    libxcb-xinerama0 \
    libxcb-xkb1 \
    libxkbcommon-x11-0 \
    wget \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt

RUN wget -q "https://download.slicer.org/download?version=5.12.0&os=linux&stability=release" -O slicer.tar.gz \
    && tar -xzf slicer.tar.gz \
    && rm slicer.tar.gz \
    && mv Slicer-* Slicer

RUN set -eux; \
    for file_id in \
      6a3bef143e1fb85a584755ed \
      6a3c040d3e1fb85a58476cb7 \
      6a3f94c73e1fb85a584a3965 \
      6a3c07ad3e1fb85a58476f8b; do \
      wget -q "https://slicer-packages.kitware.com/api/v1/file/${file_id}/download" -O extension.tar.gz; \
      tar -xzf extension.tar.gz -C /opt/Slicer --strip-components=1; \
      rm extension.tar.gz; \
    done

RUN ldd /opt/Slicer/bin/PythonSlicer | sort \
    && ! ldd /opt/Slicer/bin/PythonSlicer | grep "not found"

RUN /opt/Slicer/bin/PythonSlicer -m pip install --no-cache-dir --upgrade pip \
    && /opt/Slicer/bin/PythonSlicer -m pip install --no-cache-dir boto3 supabase

RUN xvfb-run -a /opt/Slicer/Slicer --no-main-window --disable-cli-modules --python-code "print('slicer-startup-ok'); slicer.app.exit(0)"
RUN xvfb-run -a /opt/Slicer/Slicer --no-main-window --disable-cli-modules --python-code "assert hasattr(slicer.modules, 'kretzfilereader'), 'kretzfilereader module not loaded'; print('kretz-reader-ok'); slicer.app.exit(0)"

WORKDIR /app
COPY ConvertVolToNifti.py /app/ConvertVolToNifti.py
COPY run_conversion.py /app/run_conversion.py
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
RUN VOLUME_ID=dry-run S3_INPUT_KEY=dry-run VOLUME_NAME=dry-run CONVERSION_DRY_RUN=1 /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
