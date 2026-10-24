# embed-video

Custom **embed** block. Purpose: Responsive 16:9 YouTube/Vimeo/MP4 player with optional poster image, heading, description and collapsible transcript.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: a cell with the video link (YouTube, Vimeo or .mp4); optionally a poster picture (click to play), heading/text/CTA cells, and a transcript: a paragraph labelled 'Transcript', 'Transcription' or 'Read transcript' followed by the transcript text, either in the same cell or in the next cell, or as a single link to a /fragments/ path loaded on first open.

## Supported variations

| Variation | Option class |
| --- | --- |
| Light | `light` |
| Image | `image` |
| Dark | `dark` |

## Universal Editor fields

N/A (Document Authoring project)

## Notes

- Without a poster the player is created when the block nears the viewport; with a poster it loads on click and autoplays.
- The transcript label becomes a button (`aria-expanded`) that reveals the transcript.
