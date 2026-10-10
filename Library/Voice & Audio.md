# Voice & Audio

[[Library|← Back to Library index]] · Related: [[Diffusion & Flow Matching]] · [[Vision & Multimodal]] · [[Inference & Serving]]

Speech recognition, speech synthesis, audio representations, and spoken interaction. Dedicated ASR, TTS, neural-codec, and speech-to-speech resources belong in this domain.

### Speech recognition

<!-- resource-id: voice-audio__speech-to-text-from-scratch -->
- **[Speech-to-Text Transformer from Scratch](https://blogs.mayankpratapsingh.in/chapters/speech-to-text-from-scratch)** · `Blog` · Mayank Pratap Singh · *—*
  A PyTorch-oriented walkthrough of an ASR pipeline combining acoustic feature processing, convolutional and Transformer components, vector quantization, and CTC training. It is useful for following data and tensor transformations through a speech recognizer; training results were not reproduced.
  *Key concepts:* ASR, CTC, Transformers, Residual vector quantization, PyTorch

<!-- resource-id: voice-audio__sherpa-onnx-on-device-speech-processing -->
- **[sherpa-onnx: On-device Speech Processing](https://github.com/k2-fsa/sherpa-onnx)** · `Repo` · k2-fsa contributors · *—*
  An ONNX-based speech toolkit covering recognition, synthesis, voice activity detection, speaker processing, and related audio tasks. The repository documents language bindings and deployment platforms for local/offline applications.
  *Key concepts:* ASR, TTS, ONNX, On-device inference, Voice activity detection

<!-- resource-id: voice-audio__sequence-transduction-with-rnn-t -->
- **[Sequence-to-sequence learning with Transducers](https://lorenlugosch.github.io/posts/2020/11/transducer)** · `Blog` · Loren Lugosch · *2020-11-16*
  An illustrated introduction to RNN transducers that connects acoustic encoders, label-history prediction, and alignment paths. It contrasts RNN-T with CTC and attention-based sequence models and links a small implementation; the comparisons should be read in their 2020 context.
  *Key concepts:* ASR, RNN-T, CTC, Sequence alignment, Streaming inference

<!-- resource-id: voice-audio__speech-recognition-from-scratch-with-speechbrain -->
- **[Speech Recognition from Scratch with SpeechBrain](https://speechbrain.readthedocs.io/en/latest/tutorials/tasks/speech-recognition-from-scratch.html)** · `Blog` · SpeechBrain documentation · *—*
  A hands-on ASR recipe covering audio loading, acoustic features, model training, and decoding in SpeechBrain. It exposes the data pipeline and end-to-end recognizer components, making it useful for understanding how a training recipe fits together.
  *Key concepts:* ASR, SpeechBrain, Acoustic features, Data augmentation, Sequence-to-sequence

<!-- resource-id: voice-audio__rnn-t-based-asr-systems-slides -->
- **[RNN-T Based ASR Systems (Slides)](https://deeplearning.cs.cmu.edu/S21/document/slides/CMU_rnnt_asr_tutorial.pdf)** · `Course` · Mahaveer Jain / Facebook, hosted by CMU · *—*
  Introduces RNN-T through acoustic features, CTC comparisons, and the encoder-predictor-joiner architecture. The slides develop alignment-based training and decoding and discuss production deployment constraints.
  *Key concepts:* ASR, RNN-T, CTC, Sequence alignment, Streaming inference

<!-- resource-id: voice-audio__nemo-introduction-to-transducers -->
- **[NeMo: Introduction to Transducers](https://colab.research.google.com/github/NVIDIA/NeMo/blob/stable/tutorials/asr/Intro_to_Transducers.ipynb)** · `Repo` · NVIDIA NeMo contributors · *—*
  An educational notebook introducing transducer loss and RNN-T as an alternative to CTC-based speech recognition. It combines conceptual comparisons with NeMo code; the inspected notebook pins an older release-candidate dependency and should be adapted before use.
  *Key concepts:* ASR, RNN-T, CTC, NeMo, Sequence alignment

<!-- resource-id: voice-audio__evaluating-wav2vec2-bert-for-asr -->
- **[Wav2Vec2-BERT+LM: Transcribing Speech and Evaluating Models using Huggingface Transformers](https://kavyamanohar.com/post/evaluating-wav2vec2-bert-asr)** · `Blog` · Kavya Manohar · *—*
  A practical exploration of a pretrained speech encoder for recognition, including decoding with an external language model. The walkthrough links representation learning to ASR evaluation and discusses comparisons with other speech-model approaches.
  *Key concepts:* ASR, Wav2Vec2-BERT, Language-model decoding, Speech representations, WER

### Speech synthesis & codecs

<!-- resource-id: voice-audio__miratts -->
- **[MiraTTS](https://github.com/ysharma3501/MiraTTS)** · `Repo` · Yatharth Sharma / ysharma3501 · *—*
  A Spark-TTS-derived speech model with an inference recipe combining LMDeploy and FlashSR audio enhancement. The README documents reference-audio conditioning and batch generation; its speed claims are specific to the author's setup.
  *Key concepts:* TTS, Speech synthesis, LMDeploy, Audio super-resolution, Voice cloning

<!-- resource-id: voice-audio__a-practical-guide-to-llm-based-text-to-speech -->
- **[LLM based Audio models](https://huggingface.co/blog/YatharthS/llm-tts-models)** · `Blog` · Yatharth Sharma / Hugging Face · *2025-12-18*
  Introduces speech synthesis built from a language model and neural audio codecs, connecting codebooks and token rates to generation cost. Useful for comparing discrete speech representations and the modeling choices behind LLM-based TTS.
  *Key concepts:* TTS, Neural audio codecs, Autoregressive models, Vector quantization, Speech representations

<!-- resource-id: voice-audio__making-neutts-200x-realtime -->
- **[How to make NeuTTS-air generate over 200 seconds of audio in a single second.](https://huggingface.co/blog/YatharthS/making-neutts-200x-realtime)** · `Blog` · Yatharth Sharma / Hugging Face · *2025-11-21*
  An engineering report on accelerating NeuTTS Air with LMDeploy and cache-oriented inference optimizations. The reported real-time multiple is a benchmark on a specified GPU and precision configuration, not a portable latency guarantee.
  *Key concepts:* TTS, LMDeploy, KV cache, Quantization, Inference benchmarking

<!-- resource-id: voice-audio__voxcpm-tokenizer-free-tts-for-context-aware-speech-generation -->
- **[VoxCPM: Tokenizer-Free TTS for Context-Aware Speech Generation and True-to-Life Voice Cloning](https://arxiv.org/abs/2509.24650)** · `Paper` · VoxCPM authors / arXiv · *2025-09-29*
  VoxCPM separates semantic-prosodic planning from residual acoustic detail and conditions a local diffusion decoder on those representations. The abstract describes end-to-end training without an external speech tokenizer and reports results for a 0.5B model.
  *Key concepts:* TTS, Diffusion models, Speech representations, Autoregressive models, End-to-end training

<!-- resource-id: voice-audio__optimizing-quality-vs-latency-in-speech-generation -->
- **[Optimizing Quality vs. Latency in Speech Generation](https://gradium.ai/blog/optimizing-quality-vs-latency)** · `Blog` · Gradium · *2026-02-11*
  Gradium explains delayed-streams speech models and the tradeoff among first-audio latency, batch size and the number of residual audio codebooks. CUDA graphs and kernel fusion reduce launch overhead for small streaming models. The article's real-time-factor convention should be checked before comparing it with ASR/TTS benchmarks.
  *Key concepts:* TTS, Streaming audio, Neural audio codecs, CUDA graphs, Latency

<!-- resource-id: voice-audio__tada-text-acoustic-dual-alignment -->
- **[Opensourcing TADA: Fast, Reliable Speech Generation Through Text-Acoustic Synchronization](https://hume.ai/blog/opensource-tada)** · `Blog` · Sharath Rao & Mori Liu / Hume AI · *2026-03-10*
  TADA aligns one continuous acoustic representation with each text token, then uses a flow-matching head to generate speech features. Hume reports reduced generation cost and fewer text omissions or insertions under its evaluation protocol. Reported hallucination reductions apply to the tested settings, not a proof that speech errors are impossible.
  *Key concepts:* TTS, Flow matching, Text-audio alignment, Speech representations, Hallucination evaluation

<!-- resource-id: voice-audio__zipvoice-flow-matching-speech-synthesis -->
- **[ZipVoice: Flow-Matching Speech Synthesis](https://github.com/k2-fsa/ZipVoice)** · `Repo` · k2-fsa / ZipVoice contributors · *—*
  A lightweight flow-matching TTS model family with recipes for speech generation and dialogue-oriented variants. The README provides pretrained assets, examples, and deployment details; its quality and speed comparisons remain the authors' reported evaluations.
  *Key concepts:* TTS, Flow matching, Voice cloning, Dialogue speech, Model deployment

<!-- resource-id: voice-audio__x2streaming-tts-causal-token-level-text-to-speech-from-streaming-text-with-speech-state-inheritance -->
- **[X2Streaming-TTS: Causal Token-Level Text-to-Speech from Streaming Text with Speech-State Inheritance](https://arxiv.org/abs/2608.18661)** · `Paper` · Rime Wen, Zehan Liu et al. / arXiv · *2026-08-19*
  Presents token-level TTS that accepts asynchronously arriving text without reading future input. Uncertainty-aware segmentation and inherited speech state address ambiguous prefixes and continuity across chunks, with latency and quality evaluated under the authors' stated serving conditions.
  *Key concepts:* Streaming TTS, Causal generation, Speech-state inheritance, Segmentation, Low-latency speech

<!-- resource-id: voice-audio__pocket-tts -->
- **[Pocket TTS](https://github.com/kyutai-labs/pocket-tts)** · `Repo` · Kyutai · *—*
  A lightweight speech-synthesis implementation designed for CPU execution, audio streaming, and voice conditioning. The README separates inference interfaces, model variants, and newly released training material; hardware-specific speed claims and voice quality were not independently tested.
  *Key concepts:* Text-to-speech, CPU inference, Streaming audio, Voice conditioning, Speech training

<!-- resource-id: voice-audio__audio8-tts-preview-0-1b-onnx-int8 -->
- **[Audio8 TTS Preview 0.1B — ONNX INT8](https://huggingface.co/Edge0/audio8-TTS-0.1B-ONNX-INT8)** · `Repo` · Audio8 / Edge0 · *—*
  A CPU-oriented model package for compact multilingual TTS, combining quantized token-generation graphs with audio-codec components. The model card separates downloadable weights from the compatible runtime and warns that the older runtime for a different model variant is incompatible.
  *Key concepts:* Text-to-speech, ONNX, INT8 quantization, CPU inference, Audio codecs


### Spoken interaction

<!-- resource-id: voice-audio__hibiki-zero-low-latency-speech-to-speech-translation -->
- **[Simultaneous Speech-to-Speech Translation Without Aligned Data](https://arxiv.org/abs/2602.11072)** · `Paper` · Hibiki-Zero authors / arXiv · *2026-02-11*
  Hibiki-Zero first learns high-latency speech translation with sentence-level alignments, then uses GRPO to reduce latency while maintaining translation quality. The method avoids word-level alignment heuristics and provides weights, inference code and evaluation data.
  *Key concepts:* Speech translation, GRPO, Latency, Speech-to-speech, Reinforcement learning

<!-- resource-id: voice-audio__delayed-streams-modeling-streaming-speech-models -->
- **[Delayed Streams Modeling: Streaming Speech Models](https://github.com/kyutai-labs/delayed-streams-modeling)** · `Repo` · Kyutai Labs · *—*
  The official implementation hub for Kyutai streaming speech recognition and synthesis. Its README describes delayed-stream modeling, word timestamps and semantic voice activity, and separates research and deployment implementations across PyTorch, Rust, and MLX.
  *Key concepts:* Streaming audio, ASR, TTS, Voice activity detection, Speech-to-speech

<!-- resource-id: voice-audio__real-time-hallucination-correction-in-voice-agents -->
- **[Real-Time Hallucination Correction at Zero Latency Cost](https://giga.ai/hallucinations)** · `Blog` · Esha Dinne, Rishi Alluri & Arnab Maiti / Giga · *2026-05-07*
  Giga runs a verifier concurrently with voice playback, using the gap between text-generation and speaking speed to detect unsupported output. It either replaces unheard audio or explicitly corrects speech already heard, and discards temporary correction hints afterward. This is an implementation report with production-specific tradeoffs, not a guarantee of factual output.
  *Key concepts:* Voice agents, Hallucination detection, Streaming audio, Verification, Latency
