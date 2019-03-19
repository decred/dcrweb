#/bin/sh

# Encodes a MOV file into web streaming optimized MP4, VP8 and VP9 formats

INPUT=../explainer/Decred_Explainer_3_3.mov
OUTDIR=src/static/videos/explainer
OUTFILENAME=what_is_decred

# 2 pass webm (VP9) encoding
#ffmpeg -i $INPUT -c:v libvpx-vp9 -pass 1 -b:v 1400K -crf 23 -threads 4 -speed 4 -tile-columns 6 -frame-parallel 1 -an -f webm /dev/null
#ffmpeg -i $INPUT -c:v libvpx-vp9 -pass 2 -b:v 1400K -crf 23 -threads 4 -speed 2 -tile-columns 6 -frame-parallel 1 -auto-alt-ref 1 -lag-in-frames 25 -c:a libvorbis -f webm $OUTDIR/$OUTFILENAME.vp9.webm

# webm (VP8) encoding
ffmpeg -i $INPUT -c:v libvpx -qmin 0 -qmax 50 -crf 5 -b:v 2000k -c:a libvorbis $OUTDIR/$OUTFILENAME.webm

# H.264 MP4
ffmpeg -i $INPUT  -movflags +faststart -c:a aac -c:v libx264  -preset veryslow -b:v 1600k -vf format=yuv420p -profile:v baseline -level 3.0 $OUTDIR/$OUTFILENAME.mp4

