# Library addition-date audit (2026-10-13)

`addedAt` means the first **committed appearance** of a Library entry, not the
source's publication date, an X repost date, or a browser-capture date. The
build scans all 53 Library-touching Git commits with full history. For a unique
URL it can look through the 2026-10-10 ID migration; for a stable ID it follows
the ID through later title, topic, and URL edits.

All 461 current resources have an addition date. The 2026-09-09 snapshot had
213 entries; 212 still have the same URL today and the remaining CS 185/285
course was traced from its original YouTube URL to its current course homepage.
The current Library therefore retains all 213 pre-redesign entries. The other
248 first appear in October commits. Canonical-URL collision checks found only
the three duplicate-source pairs below; there were no further aliases to
disambiguate.

Seven legacy identities need explicit `provenance.addedAt` because a duplicate
URL or changed URL makes the generic ID/URL heuristic too late:

| Resource ID suffix | First recorded commit | Vietnam time | Evidence |
| --- | --- | --- | --- |
| `on-policy-distillation__on-policy-distillation` | `8c2bfce` | 2026-07-09 12:00:50 | Already in the original On-Policy Distillation page. |
| `thinking-machines-lab__on-policy-distillation` | `8c2bfce` | 2026-07-09 12:00:50 | Separate original publisher-page entry. |
| `llm-architecture-scaling-laws__linear-attention-explained` | `0abcb64` | 2026-08-06 22:02:47 | First `Linear Attention Explained` entry. |
| `llm-architecture-scaling-laws__linear-attention-explained-part-1` | `cb09871` | 2026-08-06 22:06:10 | Later `Part 1` entry with the same URL. |
| `gpu-cuda-kernels__inside-nvidia-gpus-anatomy-of-high-performance-matmul-kernels` | `3d7319e` | 2026-08-09 20:50:55 | New entry above the Matmul section heading. |
| `gpu-cuda-kernels__inside-nvidia-gpus-anatomy-of-high-performance-matmul-kernels-2` | `8c2bfce` | 2026-07-09 12:00:50 | Original entry *inside* the Matmul section. |
| `reinforcement-learning__cs-185-285-deep-reinforcement-learning-decision-making-and-control-spring-2026` | `1b29171` | 2026-08-23 23:41:31 | Original course entry pointed to a YouTube lecture; the URL was replaced later. |

The three recent repost-derived Library entries now use their first commit
`fd0906d` at 2026-10-12 23:48:19 +07, rather than the earlier manually recorded
review timestamp. This makes their displayed date independently reproducible.

**Limit:** The root commit `8c2bfce` contains 178 resources. Git proves only
that they were present **by** 2026-07-09 12:00:50 +07; it cannot recover their
individual earlier creation dates. The UI therefore labels these "In Library
by Jul 9, 2026" instead of claiming they were all added on that day. For
later entries, commit timestamps are the first durable repository record,
which can lag an uncommitted local edit.

The regression test in `scripts/library-added-at.test.ts` checks every current
resource against Git history or one of the seven audited overrides, plus the
178/213 snapshot counts. `Recently added` renders dates in the Library owner's
`Asia/Ho_Chi_Minh` timezone so viewers abroad see the same calendar day.
