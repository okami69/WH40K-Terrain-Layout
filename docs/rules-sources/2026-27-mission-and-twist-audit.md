# Chapter Approved 2026-27 Content Audit

Inspection date: 2026-08-09. Scope: the current 2026-27 mission pack only; the obsolete June Event Companion and the older nine-card Twist set are excluded.

## Versions

- Event Companion: **v1.1**, local approved PDF `D:\WH40K Terrain Layout\eng_22_07_warhammer_40,000_event_companion_alyapl19us_b2drgwkji4.pdf`, SHA-256 `97AE5591BE2E58BDB636E97127EAC0877F9BF28B29FC607ED4EAD4D377FB8F20` (93 pages).
- Official Warhammer 40,000 app: package `com.gamesworkshop.w40k`, app `2.4.0`, versionCode `139`, released 2026-08-05; embedded `metadata.data_version` **925**. Mission pack UUID `4f285f2e-3c40-40fb-8b2f-bfccd173f1fd`, localized EN name `Chapter Approved 2026-2027`.
- Captured signed package: `D:\Temp\okami\w40k-app-2.4.0`, bundle SHA-256 `A908E4842A2C28D93962B6CA13F3CBA97214ACBF080C6844AF6F4844BA7EC97D`. Extracted rules source: `D:\Temp\okami\w40k-app-2.4.0\base\assets\dump.json`, SHA-256 `78E56902FE11D2EF4DA29F51D7BFB8BBD3FA2489BE86B4918F83CB7E29CBF4ED`. Base APK verifies with APK Signature Scheme v2 and v3 plus SourceStamp; signer certificate SHA-256 `ce6b982051e7140507a1bde17ff099a0ec27c305f68f88d5cfd369655a8de231`.
- GDM mission text: **version 4.9**, released 2026-07-25, inspected 2026-08-09 at `https://game-datamissions.com/version-history` and the 25 URLs below. All 25 returned HTTP 200 with structured Primary data.
- Official corroboration: `https://www.warhammer-community.com/en-gb/articles/oefzq9fg/new40k-how-your-army-affects-your-mission/` confirms the five dispositions, optional Twists, Mirrored World/Scrambled Communications behavior, and 45VP/15VP caps; `https://www.warhammer-community.com/en-gb/articles/ka6kjyka/warhammer-40000-faction-focus-thousand-sons/` corroborates Martial Pride.

## Global mission rules and translation notes

- Primary Mission scoring is capped at **45VP per game** and **15VP per battle round**. End-of-battle VP is not subject to the 15VP battle-round cap.
- `cumulative`: score the normal condition and the following cumulative condition when both are achieved. `or`: score only one listed alternative or the normal condition. Underlined `one` means exactly one. VP beyond a printed limit is ignored.
- Removing an operation marker also removes the status it applied. A Primary Mission operation marker cannot be removed unless that mission specifies how and when.
- FAQ applications: Death Trap does not require the terrain area to have been trapped at the instant the unit was destroyed; Surveil the Foe may score if the relevant marker is removed later in the same turn; Vital Link markers can be split across central objectives provided those objectives are controlled.
- RU policy used for the checks below: preserve every number, phase/turn/battle-round boundary, `and`/`or`, cumulative relationship, `one` versus `one or more`, per-unit/per-objective scope, action start/completion/restriction, keyword, status, and marker ownership. Natural Russian wording may change sentence order but not logic. Keep game keywords visibly distinct; do not translate `BATTLELINE`, `MOBILE`, `SOLID`, `[INDIRECT FIRE]`, or named mission/status terms into ambiguous everyday synonyms.

## Primary Missions

Official-app comparison joined all 25 app `primary_mission` records to 74 objectives, their scoring rows, and 11 reverse-side actions. GDM and app agree on section/condition counts, VP, cumulative/alternative flags, and action fields for all 25 missions; the only textual normalization was a straight versus typographic apostrophe in Vanguard Operation.

| ID | Official app/card checked | GDM text checked | RU checked | Notes |
|---|---:|---:|---:|---|
| battlefield-dominance | yes | yes | yes | timing and VP tiers agree |
| determined-acquisition | yes | yes | yes | timing and VP tiers agree |
| immovable-object | yes | yes | yes | timing and VP tiers agree |
| inescapable-dominion | yes | yes | yes | timing and VP tiers agree |
| purge-and-secure | yes | yes | yes | timing and VP tiers agree |
| unstoppable-force | yes | yes | yes | timing and VP tiers agree |
| meatgrinder | yes | yes | yes | timing and VP tiers agree |
| punishment | yes | yes | yes | timing/VP agree; rule, status |
| consecrate | yes | yes | yes | timing/VP agree; rule, operation markers, status |
| destroyers-wrath | yes | yes | yes | timing and VP tiers agree |
| death-trap | yes | yes | yes | timing/VP agree; reverse action, operation markers, status |
| delaying-action | yes | yes | yes | timing and VP tiers agree |
| outmanoeuvre | yes | yes | yes | timing and VP tiers agree |
| smoke-and-mirrors | yes | yes | yes | timing/VP agree; reverse action, operation markers, status |
| locate-and-deny | yes | yes | yes | timing/VP agree; rule, reverse action, operation markers, status |
| reconnaissance-sweep | yes | yes | yes | timing and VP tiers agree |
| triangulation | yes | yes | yes | timing/VP agree; reverse action, operation markers, status |
| surveil-the-foe | yes | yes | yes | timing/VP agree; rule, reverse action, operation markers, status |
| gather-intel | yes | yes | yes | timing/VP agree; reverse action, operation markers |
| search-and-scour | yes | yes | yes | timing and VP tiers agree |
| secure-asset | yes | yes | yes | timing/VP agree; reverse action, status |
| vital-link | yes | yes | yes | timing/VP agree; reverse action, operation markers |
| extract-relic | yes | yes | yes | timing/VP agree; reverse action, operation markers, status |
| vanguard-operation | yes | yes | yes | timing/VP agree; reverse action, status |
| sabotage | yes | yes | yes | timing/VP agree; reverse action, status |

### Structured implementation oracle

Each entry is ordered as printed. `per-*`, `cumulative`, and `or` are implementation flags, not editorial commentary. A missing overview or reverse side means the card has none.

#### `battlefield-dominance` - Battlefield Dominance

- FIRST & SECOND BATTLE ROUND; End of your turn: 2VP - You control more **objectives** than your opponent.
- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 3VP [per-objective] - For each **objective** you control. | 2VP [cumulative, per-objective] - For each of those **objectives** (excluding your **home objective**) if you control your **home objective**.
- Source: https://game-datamissions.com/11th/primary-missions/take-and-hold/battlefield-dominance

#### `determined-acquisition` - Determined Acquisition

- ANY BATTLE ROUND; End of your turn: 2VP [per-objective] - For each **objective** you control that you did not control at the start of the turn (excluding your **home objective**).
- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 3VP [per-objective] - For each **objective** you control. | 3VP [cumulative, per-objective] - For each of those **objectives** that is within your opponent's territory.
- Source: https://game-datamissions.com/11th/primary-missions/take-and-hold/determined-acquisition

#### `immovable-object` - Immovable Object

- ANY BATTLE ROUND; End of your turn: 3VP - You control one or more **central objectives**.
- SECOND TO FOURTH BATTLE ROUND; End of your Command phase: 5VP [per-objective] - For each **objective** you control (excluding your **home objective**).
- FIFTH BATTLE ROUND; End of your turn: 5VP [per-objective] - For each **objective** you control (excluding your **home objective**).
- Source: https://game-datamissions.com/11th/primary-missions/take-and-hold/immovable-object

#### `inescapable-dominion` - Inescapable Dominion

- ANY BATTLE ROUND; End of your turn: 4VP - You control three or more **objectives**.
- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 5VP - You control two or more **objectives**. | 4VP - You control more **objectives** than your opponent.
- END OF BATTLE: 5VP - You control your opponent's **home objective**.
- Source: https://game-datamissions.com/11th/primary-missions/take-and-hold/inescapable-dominion

#### `purge-and-secure` - Purge and Secure

- ANY BATTLE ROUND; End of your turn: 3VP - One or more enemy units were **destroyed** this turn by a friendly unit that was within range of one or more **objectives**. | 3VP [or] - One or more enemy units that started the turn within range of one or more **objectives** were **destroyed** this turn.
- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 4VP [per-objective] - For each **objective** you control (excluding your **home objective**).
- SECOND BATTLE ROUND ONWARDS; End of your turn: 3VP - You control one or more **objectives** you did not control at the start of the turn (excluding your **home objective**).
- Source: https://game-datamissions.com/11th/primary-missions/take-and-hold/purge-and-secure

#### `unstoppable-force` - Unstoppable Force

- ANY BATTLE ROUND; End of your turn: 3VP - One or more enemy units were **destroyed** this turn.
- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 4VP [per-objective] - For each **objective** you control (excluding your **home objective**).
- SECOND BATTLE ROUND ONWARDS; End of your turn: 3VP - You control one or more **objectives** you did not control at the start of the turn (excluding your **home objective**).
- END OF BATTLE: 5VP - You control one or more **central objectives**.
- Source: https://game-datamissions.com/11th/primary-missions/purge-the-foe/unstoppable-force

#### `meatgrinder` - Meatgrinder

- ANY BATTLE ROUND; End of your turn: 3VP - One or more enemy units were **destroyed** this turn.
- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 4VP - You control one or more **objectives** (excluding your **home objective**).
- SECOND BATTLE ROUND ONWARDS; End of your turn: 5VP - More enemy units were **destroyed** this turn than friendly units were **destroyed** in the previous turn. | 5VP - You control your opponent's **home objective**.
- Source: https://game-datamissions.com/11th/primary-missions/purge-the-foe/meatgrinder

#### `punishment` - Punishment

- Overview/rule: **START OF YOUR TURN:** Select one to three enemy units that are on the battlefield and within range of **objectives** and/or that **destroyed** one or more friendly units in the previous turn. If you cannot, select one enemy unit that is on the battlefield. Until the start of your next turn, those units are **condemned**.
- ANY BATTLE ROUND; End of a turn: 5VP - One or more **condemned** enemy units left the battlefield this turn.
- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 4VP - You control one or more **objectives** (excluding your home **objective**). | 5VP - You control more **objectives** than your opponent.
- END OF BATTLE: 8VP - You control your opponent's **home objective**.
- Source: https://game-datamissions.com/11th/primary-missions/purge-the-foe/punishment

#### `consecrate` - Consecrate

- Overview/rule: Each time a friendly unit **destroys** a unit, that friendly unit becomes a **consecration** unit. At the end of your turn, for each of your **consecration** units, you can select one **objective** it is within range of (excluding your **home objective**) that has not been **consecrated**. If you do, place one of your operation markers within range of that **objective** – that **objective** is **consecrated** and that unit is no longer a **consecration** unit.
- ANY BATTLE ROUND; End of your turn: 3VP - One or two **objectives** are **consecrated**. | 6VP [or] - Three or more **objectives** are **consecrated**.
- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 4VP - You control one or more **objectives** (excluding your **home objective**). | 4VP - You control more **objectives** than your opponent.
- END OF BATTLE: 5VP - Your opponent's **home objective** is **consecrated**.
- Source: https://game-datamissions.com/11th/primary-missions/purge-the-foe/consecrate

#### `destroyers-wrath` - Destroyer's Wrath

- ANY BATTLE ROUND; End of your turn: 3VP - One or more enemy units were **destroyed** this turn.
- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 4VP - You control one or more **objectives** (excluding your **home objective**). | 6VP - You control more **objectives** than your opponent.
- SECOND BATTLE ROUND ONWARDS; End of your turn: 4VP - More enemy units were **destroyed** this turn than friendly units were **destroyed** in the previous turn.
- Source: https://game-datamissions.com/11th/primary-missions/purge-the-foe/destroyers-wrath

#### `death-trap` - Death Trap

- ANY BATTLE ROUND; End of your turn: 2VP [per-terrain-area] - For each **terrain area trapped** this turn. | 3VP [cumulative, per-objective] - For each of those **terrain areas** that is an **objective**.
- ANY BATTLE ROUND; End of your turn: 3VP - One or more enemy units that started the turn within a terrain area were destroyed, if that terrain area is **trapped**.
- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 4VP - You control one or more **objectives** (excluding your **home objective**).
- Reverse - Booby Trap: Starts: Your Shooting phase. | Units: One friendly unit within range of one **objective** (excluding your **home objective**) or within one **terrain area** that is not within your deployment zone, that you have not yet **trapped** (see below). | Use limit: Unlimited. Each unit that starts this **action** this phase must be within a different **terrain area**. | Completes: Immediately. | Effect: That **terrain area** is **trapped**: place one of your **operation markers** within that **terrain area**.
- Source: https://game-datamissions.com/11th/primary-missions/disruption/death-trap

#### `delaying-action` - Delaying Action

- ANY BATTLE ROUND; End of your turn: 2VP [per-unit] - For each enemy unit **destroyed** this turn.
- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 4VP - You control one or more **objectives** (excluding **home objectives**).
- SECOND BATTLE ROUND ONWARDS; End of your turn: 3VP - You control one or more **central objectives** and one or more **expansion objectives**.
- Source: https://game-datamissions.com/11th/primary-missions/disruption/delaying-action

#### `outmanoeuvre` - Outmanoeuvre

- ANY BATTLE ROUND; End of your turn: 10VP - You control your opponent's **home objective**.
- FIRST BATTLE ROUND; End of your turn: 4VP [per-objective] - For each **objective** you control (excluding your **home objective**).
- SECOND & THIRD BATTLE ROUND; End of your Command phase: 5VP [per-objective] - For each **objective** you control (excluding your **home objective**).
- FOURTH BATTLE ROUND ONWARDS; End of your turn: 6VP [per-objective] - For each **objective** you control (excluding your **home objective**).
- Source: https://game-datamissions.com/11th/primary-missions/disruption/outmanoeuvre

#### `smoke-and-mirrors` - Smoke and Mirrors

- ANY BATTLE ROUND; End of your turn: 2VP [per-objective] - For each **objective** that is **decoyed** (see reverse). | 2VP [cumulative, per-objective] - For each of those **objectives** that is within your opponent's territory.
- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 4VP - You control one or more **objectives** (excluding your **home objective**).
- END OF BATTLE: 10VP - **Four or more objectives** are **decoyed**.
- Reverse - Decoy: Starts: Your Shooting phase. | Units: One friendly unit within range of one **objective** (excluding your **home objective**) that is not **decoyed** (see below). | Use limit: Unlimited. Each unit that starts this **action** this phase must be within range of a different **objective**. | Completes: End of your turn, if your unit controls that **objective**. | Effect: That **objective** is **decoyed**: place one of your **operation markers** within range of that **objective**.
- Source: https://game-datamissions.com/11th/primary-missions/disruption/smoke-and-mirrors

#### `locate-and-deny` - Locate and Deny

- Overview/rule: **START OF THE BATTLE:** Select five **terrain areas** not within your deployment zone; for each one, place one of your **operation markers** within it. If you cannot, do so for each **terrain area** that is not within your deployment zone.
- ANY BATTLE ROUND; End of your turn: 4VP - One or more enemy units that started the turn within range of one or more **objectives** are **destroyed**. | 4VP - Only one of your **operation markers** is on the battlefield, if one or more of your units are within the same **terrain area** as that **marker**, and no enemy units are within that **terrain area**.
- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 4VP - You control one or more **objectives** (excluding your **home objective**).
- END OF BATTLE: 5VP - Only one of your **operation markers** is on the battlefield, if one or more of your units are within the same **terrain area** as that **marker**, and no enemy units are within that **terrain area**.
- Reverse - Sensor Sweep: Starts: Your Shooting phase. | Units: One friendly unit within range of one **central objective**. | Use limit: Once per turn. | Completes: End of your turn, if your unit controls that **objective**. | Effect: Your unit **performs a sensor sweep**: remove one **operation marker** from the battlefield. | Restriction: A unit cannot start this **action** if there is only one **operation marker** on the battlefield.
- Source: https://game-datamissions.com/11th/primary-missions/disruption/locate-and-deny

#### `reconnaissance-sweep` - Reconnaissance Sweep

- ANY BATTLE ROUND; End of your turn: 3VP - Three or more friendly units are wholly within three different table quarters and not within 6" of the centre of the battlefield. | 6VP [or] - Four or more friendly units are wholly within four different table quarters and not within 6" of the centre of the battlefield.
- ANY BATTLE ROUND; End of your turn: 1VP [per-unit] - For each enemy unit **destroyed** this turn.
- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 3VP - You control one or more **objectives** (excluding your **home objective**).
- Source: https://game-datamissions.com/11th/primary-missions/reconnaissance/reconnaissance-sweep

#### `triangulation` - Triangulation

- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 4VP - You control one or more **objectives** (excluding your **home objective**).
- SECOND BATTLE ROUND ONWARDS; End of your turn: 3VP - One **objective** is **triangulated** (see reverse). | 6VP [or] - Two **objectives** are **triangulated**. | 10VP [or] - Three or more **objectives** are **triangulated**.
- END OF BATTLE: 10VP - You control four or more **objectives**.
- Reverse - Triangulate: Starts: Your Shooting phase, from the second battle round onwards. | Units: One friendly unit within range of one **objective** (excluding your **home objective**). | Use limit: Once per turn. | Completes: End of your turn, if your unit controls that **objective**. | Effect: That **objective** is **triangulated**: place one of your **operation markers** within range of that **objective**.
- Source: https://game-datamissions.com/11th/primary-missions/reconnaissance/triangulation

#### `surveil-the-foe` - Surveil the Foe

- Overview/rule: Each time a friendly unit ends a move within range of one **objective** that has any of your **opponent's operation** markers within range of it, remove those **operation markers** from the battlefield.
- ANY BATTLE ROUND; End of your turn: 4VP - One or more enemy units were **surveilled** this turn (see reverse), unless each of those units is within range of one or more **objectives** that have one or more **operation markers** within range of them.
- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 4VP - You control one or more **objectives** (excluding your **home objective**). | 4VP - You control more **objectives** than your opponent.
- SECOND BATTLE ROUND ONWARDS; End of your turn: 5VP - None of your opponent's **operation markers** are on the battlefield.
- Reverse - Surveil the Foe: Starts: Your Shooting phase. | Units: One friendly unit. | Use limit: Unlimited. | Completes: Immediately. | Effect: Select one enemy unit within 18" of and visible to your unit that has not been **surveilled** this turn: until the end of the turn, that enemy unit is **surveilled**.
- Source: https://game-datamissions.com/11th/primary-missions/reconnaissance/surveil-the-foe

#### `gather-intel` - Gather Intel

- FIRST BATTLE ROUND; End of your turn: 6VP - You control one or more **central objectives**.
- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 4VP - You control one or more **objectives** (excluding your **home objective**).
- SECOND BATTLE ROUND ONWARDS; End of your turn: 7VP [per-unit] - For each friendly unit that completed the **Extract Intelligence action** this turn.
- END OF BATTLE: 5VP - Three or more of your **operation markers** are on the battlefield. | 5VP - One of your **operation markers** is within range of your opponent's **home objective**.
- Reverse - Extract Intelligence: Starts: Your Shooting phase, from the second battle round onwards. | Units: One unit within range of one **objective** (excluding your **home objective**) that does not have any of your **operation markers** within range of it. | Use limit: Unlimited. Each unit that starts this action this phase must be within range of a different **objective**. | Completes: End of your turn, if your unit controls that **objective**. | Effect: Place one of your **operation markers** within range of that **objective**.
- Source: https://game-datamissions.com/11th/primary-missions/reconnaissance/gather-intel

#### `search-and-scour` - Search and Scour

- ANY BATTLE ROUND; End of your turn: 3VP - You control one or more **central objectives**. | 2VP - One or more enemy units that started the turn within a **terrain area** are **destroyed**.
- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 4VP [per-objective] - For each **objective** you control (excluding your **home objective**).
- END OF BATTLE: 5VP - No enemy units are wholly within your territory.
- Source: https://game-datamissions.com/11th/primary-missions/reconnaissance/search-and-scour

#### `secure-asset` - Secure Asset

- ANY BATTLE ROUND; End of your turn: 4VP - A friendly unit **secured the asset** this turn (see reverse). | 2VP - One or more enemy units that started the turn within range of one or more **central objectives** are **destroyed**.
- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 4VP - You control one or more **objectives** (excluding your **home objective**). | 4VP - You control three or more **objectives**.
- Reverse - Secure Asset: Starts: Your Shooting phase. | Units: One friendly unit within range of one **objective** (excluding your **home objective**). | Use limit: Once per turn. | Completes: End of your turn, if your unit controls that **objective**. | Effect: Your unit **secures the asset**.
- Source: https://game-datamissions.com/11th/primary-missions/priority-assets/secure-asset

#### `vital-link` - Vital Link

- ANY BATTLE ROUND; End of your turn: 2VP - You control one or more **central objectives**. | 1VP [cumulative, per-objective] - For each of your **operation markers** within range of one of those **objectives** (see reverse).
- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 4VP - You control one or more **objectives** (excluding your **home objective**). | 4VP [cumulative] - One or more of those **objectives** is a **central objective**.
- END OF BATTLE: 10VP - You control your opponent's **home objective**.
- Reverse - Maintain Control: Starts: Your Shooting phase. | Units: One friendly unit within range of one **central objective**. | Use limit: Once per turn. | Completes: End of your turn, if your unit controls that **objective**. | Effect: Place one of your **operation markers** within range of that **objective**.
- Source: https://game-datamissions.com/11th/primary-missions/priority-assets/vital-link

#### `extract-relic` - Extract Relic

- ANY BATTLE ROUND; End of your turn: 4VP - A friendly unit **performed a sensor sweep** this turn. | 3VP - One or more enemy units that started the turn within range of one or more **objectives** are **destroyed**. | 4VP - Only one of your opponent's **operation markers** is on the battlefield, if one or more of your units are within the same **terrain area** as that **operation marker**, and no enemy units are within that **terrain area**.
- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 4VP - You control one or more **objectives** (excluding your **home objective**).
- END OF BATTLE: 5VP - Only one of your opponent's **operation markers** is on the battlefield, if one or more of your units are within the same **terrain area** as that **operation marker**, and no enemy units are within that **terrain area**.
- Reverse - Sensor Sweep: Starts: Your Shooting phase. | Units: One friendly unit within range of one **central objective**. | Use limit: Once per turn. | Completes: End of your turn, if your unit controls that **objective**. | Effect: Your unit **performs a sensor sweep**: remove one **operation marker** from the battlefield. | Restrictions: A unit cannot start this action if there is only one **operation marker** on the battlefield.
- Source: https://game-datamissions.com/11th/primary-missions/priority-assets/extract-relic

#### `vanguard-operation` - Vanguard Operation

- ANY BATTLE ROUND; End of your turn: 4VP - A friendly unit **performed a vanguard operation** this turn. | 2VP - One or more enemy units were **destroyed** this turn.
- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 4VP - You control one or more **objectives** (excluding your **home objective**).
- END OF BATTLE: 10VP - You control your opponent's **home objective**.
- Reverse - Vanguard Operation: Starts: Your Shooting phase. | Units: One friendly unit within one terrain area that is within your **opponent's territory**. | Use limit: Once per turn. | Completes: End of your turn, if no enemy units are within that **terrain area**. | Effect: Your unit **performs a vanguard operation**.
- Source: https://game-datamissions.com/11th/primary-missions/priority-assets/vanguard-operation

#### `sabotage` - Sabotage

- ANY BATTLE ROUND; End of your turn: 3VP [per-unit] - For each friendly unit that **committed sabotage** this turn (see reverse). | 2VP [cumulative, per-objective] - For each of those units that is within range of one or more **objectives** in your opponent's territory.
- SECOND BATTLE ROUND ONWARDS; End of your Command phase (or the end of your turn in the fifth battle round): 4VP - You control one or more **objectives** (excluding your **home objective**).
- Reverse - Sabotage: Starts: Your Shooting phase. | Units: One unit within range of one **objective** (excluding your **home objective**). | Use limit: Unlimited. Each unit that starts this **action** this phase must be within range of a different **objective**. | Completes: End of your turn, if that unit controls that **objective**. | Effect: Your unit **commits sabotage**.
- Source: https://game-datamissions.com/11th/primary-missions/priority-assets/sabotage

## Twists

Source: the six `mission_twist` records belonging to current app mission pack UUID `4f285f2e-3c40-40fb-8b2f-bfccd173f1fd`, data version 925. Order is the approved chooser order. Designer notes are omitted; effects below preserve the operative rules. No APK, app-private data, or card screenshot is committed.

| # | ID / app record | English effect | Проверенный перевод RU |
|---:|---|---|---|
| 1 | `martial-pride` / `c9149128-3611-4ee4-be35-f42daa0c7e8e` | A **BATTLELINE** unit can start an action in a turn in which it made an advance move. A **BATTLELINE** unit can shoot in a turn in which it started an action. | Подразделение **BATTLELINE** может начать действие в ход, в котором оно совершило продвижение. Подразделение **BATTLELINE** может стрелять в ход, в котором оно начало действие. |
| 2 | `mirrored-world` / `194d945f-0b44-4f95-a016-5be39cb2437c` | Both players replace their Primary Mission with the same mission. If they agree, use it; otherwise roll D6: 1 Battlefield Dominance; 2 Meatgrinder; 3 Outmanoeuvre; 4 Gather Intel; 5 Sabotage; 6 re-roll. | Оба игрока заменяют свои основные миссии одной и той же миссией. При согласии используют выбранную миссию; иначе бросают D6: 1 Battlefield Dominance; 2 Meatgrinder; 3 Outmanoeuvre; 4 Gather Intel; 5 Sabotage; 6 переброс. |
| 3 | `night-fighting` / `53ae9133-3fbc-45d2-aaf2-f2ac5ec20006` | Each unit is not visible to enemy models unless they are within 18" of that unit, and cannot be targeted by **[INDIRECT FIRE]** weapons unless the attacking model is within 18" of that unit. | Подразделение не видно вражеским моделям, если те не находятся в пределах 18" от него; его нельзя выбирать целью оружия **[INDIRECT FIRE]**, если атакующая модель не находится в пределах 18" от него. |
| 4 | `nowhere-to-hide` / `e9e72f61-fef9-4e72-8ac2-9f9b662c7392` | **Terrain features** do not have the **Solid** rule. | **Элементы ландшафта** не имеют правила **Solid**. |
| 5 | `ruinscape` / `1be5bbd5-07c2-42db-acdd-764bcaafc9b2` | When a unit makes a normal or advance move, models in it have the **MOBILE** keyword until that move ends. | Когда подразделение совершает обычное перемещение или продвижение, модели в нём получают ключевое слово **MOBILE** до окончания этого перемещения. |
| 6 | `scrambled-communications` / `4c90c070-d670-4416-ae04-0bd2633754fb` | The players exchange their Primary Mission cards. | Игроки обмениваются своими картами основных миссий. |

## Provenance and implementation boundary

- The local app dump is the operative official source for Twist text. Warhammer Community is corroboration, not a substitute for the signed current app data.
- GDM is the readable mission transcription; the current official app data is the numeric, timing, status, marker, and action cross-check. The Event Companion controls event caps, terminology, and FAQs.
- Full card artwork/screens are intentionally absent. Temporary extraction paths and checksums are recorded only to make the audit reproducible; package files, credentials, and private app data remain outside the repository.
- Implementation should store concise bilingual facts, not copied card HTML or artwork. Re-check the official app data version before any later rules update.
