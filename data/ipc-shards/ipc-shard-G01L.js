window.IPC_SHARD_G01L = {
  "generatedAt": "2026-03-20T02:17:47.015Z",
  "total": 149,
  "entries": {
    "G01L": {
      "code": "G01L",
      "level": 0,
      "parent": "G01",
      "ja": "力，応力，トルク，仕事，機械的動力，機械的効率，または流体圧力の測定（重量測定Ｇ０１Ｇ）［４］<br><br><b><ul>注</ul></b><br>クラスＧ０１のタイトルに続く注に注意すること。<br><br><b><ul>サブクラス内の索引</ul></b><br>力，応力，トルク，仕事，機械的動力，機械的効率の測定<br>一般的方法；特定の目的に適合した装置　１／００，３／００；５／００<br>流体圧力の測定<br>測定方法　７／００，９／００，１１／００<br>圧力差または複数圧力の測定　１３／００，１５／００<br>装置の細部または付属品　１９／００<br>特定目的の測定装置<br>膨脹体内部圧力の測定　１７／００<br>真空計　２１／００<br>急変圧力の指示，または動作中の流体圧力エンジンの　２３／００<br>試験または較正　２５／００，２７／００",
      "en": "MEASURING FORCE, STRESS, TORQUE, WORK, MECHANICAL POWER, MECHANICAL EFFICIENCY, OR FLUID PRESSURE(weighing <b>G01G</b>);<br><br><b><u>Note(s)</u></b><br><br><ul><li>Attention is drawn to the Notes following the title of class <b>G01</b>.</li></ul><br><br><b><u>Subclass indexes</u></b><br><br><table><tr><td width=\"70%\">MEASURING FORCE, STRESS, TORQUE, WORK, MECHANICAL POWER, MECHANICAL EFFICIENCY<tr><td width=\"70%\">General methods; apparatus adapted to special purposes </td><td><b><b>1/00</b>, <b>3/00</b>; <b>5/00</b></b></td></tr></tr></tr><tr><td width=\"70%\">MEASURING FLUID PRESSURE<tr><td width=\"70%\">Methods of measuring </td><td><b><b>7/00</b>, <b>9/00</b>, <b>11/00</b></b></td></tr></tr><tr><td width=\"70%\">Measurements of differential or multiple pressure values </td><td><b><b>13/00</b>, <b>15/00</b></b></td></tr></tr><tr><td width=\"70%\">Details of apparatus or accessories </td><td><b><b>19/00</b></b></td></tr></tr></tr><tr><td width=\"70%\">SPECIAL ADAPTATIONS OF MEASURING APPARATUS<tr><td width=\"70%\">Measurements of pressure of inflated bodies </td><td><b><b>17/00</b></b></td></tr></tr><tr><td width=\"70%\">Vacuum gauges </td><td><b><b>21/00</b></b></td></tr></tr></tr><tr><td width=\"70%\">INDICATORS OF FAST CHANGES, PARTICULARLY IN THE OPERATION OF FLUID-PRESSURE ENGINES </td><td><b><b>23/00</b></b></td></tr></tr><tr><td width=\"70%\">TESTING OR CALIBRATING </td><td><b><b>25/00</b>, <b>27/00</b></b></td></tr></tr></table>",
      "count": 1735,
      "sourceFile": "ipc_G.txt",
      "kind": "ipc"
    },
    "G01": {
      "code": "G01",
      "level": 0,
      "parent": "G",
      "ja": "測定；試験<br><br><b><ul>注</ul></b><br>（１）このクラスは“真”の測定計器のほかに類似構造の他の指示表示装置又は記録装置を含み，また更に，信号化装置又は制御装置についてはそれが測定に関するものであって（以下の注（２）で定義するように）特定の信号化目的または特定の制御目的に特に適合しないものである限り，含まれる。<br>（２）このクラスにおいては，下記の用語は以下に示す意味で用いる：<br>―“測定”はその第一義的意味又は基本的な意味よりもかなり広い意味を含むものとして用いる。この語の第一義的な意味においては，変量値を単位もしくはデータに関して又は同じ性質の別の変量に関して数値的に表現することを見い出すこと，例えば長さをスケールで測定するなどある長さを別の長さの表現で表わすこと，を意味する。この変量値は直接的に得る（すぐ前で言及したように）こともあり，また，水銀柱の長さの変化を測定することにより温度変化を測定するなど求める変量値に関連づけることのできる他の変量値を測定することよって得ることもある。しかしながら，同じ装置又は計器が，直接的な表示を行う代りに，記録をとったり，指示効果又は制御効果を奏すべく信号を発生するために用いられたり，或いは，他の装置又は計器と組み合わせて同種又は異種の二以上の変量の測定から一つのまとまった結果を得るために用いられることもあるので，“測定”はかかる数値的表現を変量を数値に変換する何らかの手段の付加的使用によって得ることを可能とするような操作をも含むものとして解釈することが必要である。従って，数値での表現は実際的にはデジタル的表現によって行なうこともありスケールを読むことによって行なうこともあり，また，その指示は数値を用いないで，例えば測定されている変量が特性又は状態であるところの実在物（例．物体，物質，光ビーム）について感知し得る何らかの特性（変量）によって又はそのような特性に類似するもの（例．スケールをもたない部材の対応位置，何らかの手段によって発生される対応電圧）によって，与えられることがある。<br>また，上記のような変量値指示が行なわれずに単に基準又はデータ（その値は数値的に既知のこともあり未知のこともある）に関しての異同を示すだけのことも多くある。この基準又はデータは同一性質であるが異なる実在物（例．標準器）の値のこともあり，或いは異なる時点での同一実在物の値であることもある。その最も単純な形態においては，測定は単にある状態又は性質，例えば運動（いずれかの方向又は特定の方向における）の有無を指示するだけのこともあるし，また，変量が既定値を超えるかどうかを指示するだけのこともある。<br>（３）“マイクロ構造の装置”および“マイクロ構造のシステム”に関する，クラスＢ８１およびサブクラスＢ８１Ｂの両タイトルの後の注に注意すること。［７］<br>（４）セクションＧのタイトルに続く注，特に“変量”という用語の定義については注意はすること。<br>（５）多くの測定装置において，測定すべき第一の変量は第二の変量またはさらなる変量に変換される。第二の変量またはさらなる変量は，第一の変量に関係して構成部材に生じた状態，または構成部材の変位であるかもしれない。そして，さらに変換が必要となるかもしれない。［６］<br>このような装置を分類するときは，（ｉ）重要である特定の変換ステップ，または重要である個々の変換ステップを分類するか，または（ｉｉ）全体としてのシステムのみが重要な場合は，第一の変量を該当する箇所に分類する。［６］<br>これは２つ以上の変換が起こる場合に特に重要である。たとえば，第一の変量（例．圧力）が第二の変量（例．感知体の光学的特性）に変換され，さらにその第二の変量が第三の変量（例．電気的効果）で示されるような場合である。このような場合には，次の分類箇所を考慮しなければならない：<br>第一の変量の変換についての分類場所，その変量により生じた状態を感知することについての分類場所，測定を示すＧ０１Ｄ，そして最後に，該当する場合は，システム全体を分類する場所である。［６］<br>（６）物理的特性の値の変化の測定は，その物理的特性の測定と同一のサブクラスに分類する。例えば，長さの伸びの測定はサブクラスＧ０１Ｂに分類する。",
      "en": "MEASURING; TESTING; <br><br><b><u>Note(s)</u></b><br><br><ul><li>This class <u>covers</u>, in addition to \"true\" measuring instruments, other indicating or recording devices of analogous construction, and also signalling or control devices insofar as they are concerned with measurement (as defined in Note 2 below) and are not specially adapted to the particular purpose of signalling or control.</li><li>In this class, the following term is used with the meaning indicated: <ul><li>\"measuring\" is used to cover considerably more than its primary or basic meaning. In this primary sense, it means finding a numerical expression of the value of a variable in relation to a unit or datum or to another variable of the same nature, e.g. expressing a length in terms of another length as in measuring a length with a scale; the value may be obtained directly (as just suggested) or by measuring some other variable of which the value can be related to the value of the required variable, as in measuring a change in temperature by measuring a resultant change in the length of a column of mercury. However, since the same device or instrument may, instead of giving an immediate indication, be used to produce a record or to initiate a signal to produce an indication or control effect, or may be used in combination with other devices or instruments to give a conjoint result from measurement of two or more variables of the same or different kinds, it is necessary to interpret \"measuring\" as including also any operation that would make it possible to obtain such a numerical expression by the additional use of some way of converting a value into figures. Thus the expression in figures may be actually made by a digital presentation or by reading a scale, or an indication of it may be given without the use of figures, e.g. by some perceptible feature (variable) of the entity (e.g. object, substance, beam of light) of which the variable being measured is a property or condition or by an analogue of such a feature (e.g. the corresponding position of a member without any scale, a corresponding voltage generated in some way). In many cases there is no such value indication but only an indication of difference or equality in relation to a standard or datum (of which the value may or may not be known in figures); the standard or datum may be the value of another variable of the same nature but of a different entity (e.g. a standard measure) or of the same entity at a different time. <ul><li>In its simplest form, measurement may give merely an indication of presence or absence of a certain condition or quality, e.g. movement (in any direction or in a particular direction), or whether a variable exceeds a predetermined value.</li></ul></li></ul></li><li>Attention is drawn to the Notes following the titles of class <b>B81</b> and subclass <b>B81B</b> relating to \"microstructural devices\" and \"microstructural systems\" and the Notes following the title of subclass <b>B82B</b> relating to \"nanostructures\".</li><li>Attention is drawn to the Notes following the title of section <b>G</b>, especially as regards the definition of the term \"variable\".</li><li>In many measuring arrangements, a first variable to be measured is transformed into a second, or further, variables. The second, or further, variables may be (a) a condition related to the first variable and produced in a member, or (b) a displacement of a member. Further transformation may be needed. <ul><li>When classifying such an arrangement, (i) the transformation step, or each transformation step, that is of interest is classified, or (ii) if interest lies only in the system as a whole, the first variable is classified in the appropriate place.</li><li>This is particularly important where two or more conversions take place, for instance where a first variable, for example pressure, is transformed into a second variable, for example an optical property of a sensing body, and that second variable is expressed by means of a third variable, for example an electric effect. In such a case, the following classification places should be considered: the place for the transformation of the first variable, that for sensing the condition caused by that variable, subclass <b>G01D</b> for expression of the measurement, and finally the place for the overall system, if any.</li></ul></li><li>The measurement of change in the value of a physical property is classified in the same subclass as the measurement of that physical property, e.g. measurement of expansion of length is classified in subclass <b>G01B</b>.</li></ul>",
      "count": 0,
      "sourceFile": "ipc_G.txt",
      "kind": "ipc"
    },
    "G": {
      "code": "G",
      "level": 0,
      "parent": null,
      "ja": "物理学<br><br><b><ul>注</ul></b><br>１．このセクションにおいては，下記の用語は以下に示す意味で用いる：<br>・“変量”は名詞として，特定の実在物，例．物体，ある量の物質，光ビーム，に関し特定の瞬間に測定することの可能な特性又は特質，例．寸法，温度等の物理的状態，密度又は色等の性質，を意味する。変量が変化すると，その数値的表現は異なる時点で，異なる状態又は個々の状況において異なる値をとることもあり，また，ある状態のもとで又は実用上特定の実在物に関して一定でありうる，例．バーの長さが多くの目的のために一定とみなされる，こともある。<br>２．使用される用語または表現の定義に注意すること。このセクションのいくつかのクラスの注に使用されているものについて，特にクラスＧ０１の“測定”を参照されたい．ＩＰＣ指針パラグラフ１８７の中にあるものについて，“制御”及び“調整”の定義に参照されたい。<br>３．このセクションにおける分類は他のセクションにおいてよりもめんどうな場合があり得る，というのは，その一つは，いろいろな使用分野の差異の判別には構造上の差異又は使用形態上の差異よりも寧ろ使用者の意図における差異の方にかなりの程度影響されてしまうからであり，もう一つは，扱う主題が容易に全体として識別できる“もの”であるよりも，特性又は部品が他の主題のものと共通のものを有しているシステム又は組合わせであることが実際上多いからである。例えば，情報（例．一連の数値）をディスプレイするのは，クラスＧ０９に包含される，教育又は広告のため，クラスＧ０１に包含される，測定の結果が通知されうるため，クラスＧ０８に包含される，遠隔地点に情報を合図するため，又は遠隔地点から合図された情報を提供するためである。目的を記述するために使用する言葉は，当該装置の形態に無関係なこともあり得る特性－例えば，ディスプレイを見る者にとって望ましい効果とか，ディスプレイが遠隔地点から制御されるかどうかという特性－によって決定される。さらに，ある状態，例えば流体圧の変化に応答する装置は，その装置そのものには変更を加えずして，サブクラスＧ０１Ｌに包含される圧力又はＧ０１の他のサブクラスに包含される圧力に関連した他の何らかの状態，例．温度に関してＧ０１Ｋ，についての情報を与えるため，サブクラスＧ０７Ｃに包含される圧力または圧力発生の記録をするため，サブクラスＧ０８Ｂに包含される警報を発するため，又はクラスＧ０５に包含される他の何らかの装置を制御するために用いられることがある。<br>　本分類表は，前述したように，同一の性質のものは同一箇所に分類し得るようにしたものである。従って，技術主題が適切箇所に分類されるためには予めその真正な本質を把握することが特に必要である。",
      "en": "PHYSICS; <br><br><b><u>Note(s)</u></b><br><br><ul><li>In this section, the following term is used with the meaning indicated: <ul><li>\"variable\" as a noun means a feature or property, e.g. a dimension, a physical condition such as temperature, a quality such as density or colour, which, in respect of a particular entity, e.g. an object, a quantity of a substance, a beam of light, and at a particular instant, is capable of being measured; the variable may change, so that its numerical expression may assume different values at different times, in different conditions or in individual cases, but may be constant in respect of a particular entity in certain conditions or for practical purposes, e.g. the length of a bar may be regarded as constant for many purposes.</li></ul></li><li>Attention is drawn to the definitions of terms or expressions used. Some appear in the notes of several of the classes in this section, see in particular the definition of \"measuring\" in class <b>G01</b>. Others appear in paragraph 187 of the Guide to the IPC, see in particular the definitions of \"control\" and \"regulation\".</li><li>Classification in this section may present more difficulty than in other sections, because the distinction between different fields of use rests to a considerable extent on differences in the intention of the user rather than on any constructional differences or differences in the manner of use, and because the subjects dealt with are often in effect systems or combinations, which have features or parts in common, rather than \"things\", which are readily distinguishable as a whole. For example, information, e.g. a set of figures, may be displayed for the purpose of education or advertising covered by class <b>G09</b>, for enabling the result of a measurement to be known covered by class <b>G01</b>, for signalling the information to a distant point or for giving information which has been signalled from a distant point covered by class <b>G08</b>. The words used to describe the purpose depend on features that may be irrelevant to the form of the apparatus concerned, for example, such features as the desired effect on the person who sees the display, or whether the display is controlled from a remote point. Again, a device which responds to some change in a condition, e.g. in the pressure of a fluid, may be used, without modification of the device itself, to give information about the pressure covered by subclass <b>G01L</b> or about some other condition linked to the pressure covered by another subclass of class <b>G01</b>, e.g. <b>G01K</b> for temperature, to make a record of the pressure or of its occurrence covered by subclass <b>G07C</b>, to give an alarm covered by subclass <b>G08B</b>, or to control another apparatus covered by class <b>G05</b>. <ul><li>The classification scheme is intended to enable things of a similar nature, as indicated above, to be classified together. It is therefore particularly necessary for the real nature of any technical subject to be decided before it can be properly classified.</li></ul></li></ul>",
      "count": 0,
      "sourceFile": "ipc_G.txt",
      "kind": "ipc"
    },
    "G01L1/00": {
      "code": "G01L1/00",
      "level": 0,
      "parent": "G01L",
      "ja": "力または応力の測定一般（衝撃による力の測定Ｇ０１Ｌ５／００）［４］",
      "en": "Measuring force or stress, in general(measuring force due to impact <b>G01L5/00</b>)",
      "count": 13196,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L1/02": {
      "code": "G01L1/02",
      "level": 1,
      "parent": "G01L1/00",
      "ja": "液圧または空気圧によるもの",
      "en": "by hydraulic or pneumatic means",
      "count": 1830,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L1/04": {
      "code": "G01L1/04",
      "level": 1,
      "parent": "G01L1/00",
      "ja": "ゲージ，例．スプリング，の弾性変形の測定によるもの",
      "en": "by measuring elastic deformation of gauges, e.g. of springs",
      "count": 4231,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L1/06": {
      "code": "G01L1/06",
      "level": 1,
      "parent": "G01L1/00",
      "ja": "ゲージ，例．圧縮体，の永久変形の測定によるもの",
      "en": "by measuring the permanent deformation of gauges, e.g. of compressed bodies",
      "count": 445,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L1/08": {
      "code": "G01L1/08",
      "level": 1,
      "parent": "G01L1/00",
      "ja": "平衡力を使用するもの",
      "en": "by the use of counterbalancing forces",
      "count": 630,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L1/10": {
      "code": "G01L1/10",
      "level": 1,
      "parent": "G01L1/00",
      "ja": "応力を加えた振動素子，例．張線，の周波数変化の測定によるもの（抵抗ストレンゲージを使用するものＧ０１Ｌ１／２２）",
      "en": "by measuring variations of frequency of stressed vibrating elements, e.g. of stressed strings(using resistance strain gauges <b>G01L1/22</b>)",
      "count": 2042,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L1/12": {
      "code": "G01L1/12",
      "level": 1,
      "parent": "G01L1/00",
      "ja": "応力の印加による物質の磁気特性変化の測定によるもの",
      "en": "by measuring variations in the magnetic properties of materials resulting from the application of stress",
      "count": 3003,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L1/14": {
      "code": "G01L1/14",
      "level": 1,
      "parent": "G01L1/00",
      "ja": "電気的素子の容量またはインダクタンスの変化の測定によるもの，例．電気的発振器の周波数の変化を測定するもの",
      "en": "by measuring variations in capacitance or inductance of electrical elements, e.g. by measuring variations of frequency of electrical oscillators",
      "count": 5889,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L1/16": {
      "code": "G01L1/16",
      "level": 1,
      "parent": "G01L1/00",
      "ja": "圧電装置の特性を利用するもの",
      "en": "using properties of piezoelectric devices",
      "count": 6134,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L1/18": {
      "code": "G01L1/18",
      "level": 1,
      "parent": "G01L1/00",
      "ja": "圧抵抗物質，すなわち加えられた力の大きさまたは方向の変化に応じてオーム抵抗が変化する物質，の特性を利用するもの",
      "en": "using properties of piezo-resistive materials, i.e. materials of which the ohmic resistance varies according to changes in magnitude or direction of force applied to the material",
      "count": 5292,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L1/20": {
      "code": "G01L1/20",
      "level": 1,
      "parent": "G01L1/00",
      "ja": "固体物質または導電性流体のオーム抵抗変化の測定によるもの（圧抵抗物質のオーム抵抗変化の測定によるものＧ０１Ｌ１／１８）；動電セル，すなわち応力の印加によって電圧が誘起または変化する含液セルを利用するもの",
      "en": "by measuring variations in ohmic resistance of solid materials or of electrically-conductive fluids(of piezo-resistive materials <b>G01L1/18</b>);by making use of electrokinetic cells, i.e. liquid-containing cells wherein an electrical potential is produced or varied upon the application of stress",
      "count": 3976,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L1/22": {
      "code": "G01L1/22",
      "level": 2,
      "parent": "G01L1/20",
      "ja": "抵抗ストレンゲージを用いるもの",
      "en": "using resistance strain gauges",
      "count": 14623,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L1/24": {
      "code": "G01L1/24",
      "level": 1,
      "parent": "G01L1/00",
      "ja": "応力が加えられた時の物質の光学的特性の変化を測定することによるもの，例．光弾性応力分析によるもの",
      "en": "by measuring variations of optical properties of material when it is stressed, e.g. by photoelastic stress analysis",
      "count": 9161,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L1/25": {
      "code": "G01L1/25",
      "level": 1,
      "parent": "G01L1/00",
      "ja": "波動性または粒子性放射線，例．Ｘ線，中性子，を使用するもの（Ｇ０１Ｌ１／２４が優先）［４］",
      "en": "using wave or particle radiation, e.g. X-rays, neutrons(<b>G01L1/24</b> takes precedence)",
      "count": 1607,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L1/26": {
      "code": "G01L1/26",
      "level": 1,
      "parent": "G01L1/00",
      "ja": "力の測定に関連して行なわれる補助測定または力の測定に関連して使用される装置，例．横方向成分の力の影響の防止，過負荷の防止",
      "en": "Auxiliary measures taken, or devices used, in connection with the measurement of force, e.g. for preventing influence of transverse components of force, for preventing overload",
      "count": 3252,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L3/00": {
      "code": "G01L3/00",
      "level": 0,
      "parent": "G01L",
      "ja": "トルク，仕事，機械的動力，または機械的効率の測定一般",
      "en": "Measuring torque, work, mechanical power, or mechanical efficiency, in general",
      "count": 6364,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L3/02": {
      "code": "G01L3/02",
      "level": 1,
      "parent": "G01L3/00",
      "ja": "回転伝達式動力計",
      "en": "Rotary-transmission dynamometers",
      "count": 1101,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L3/04": {
      "code": "G01L3/04",
      "level": 2,
      "parent": "G01L3/02",
      "ja": "トルク伝達要素がねじりたわみ軸からなるもの",
      "en": "wherein the torque-transmitting element comprises a torsionally-flexible shaft",
      "count": 1294,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L3/06": {
      "code": "G01L3/06",
      "level": 3,
      "parent": "G01L3/04",
      "ja": "指示用の機械的手段を含んでいるもの",
      "en": "involving mechanical means for indicating",
      "count": 251,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L3/08": {
      "code": "G01L3/08",
      "level": 3,
      "parent": "G01L3/04",
      "ja": "指示用の光学的手段を含んでいるもの",
      "en": "involving optical means for indicating",
      "count": 495,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L3/10": {
      "code": "G01L3/10",
      "level": 3,
      "parent": "G01L3/04",
      "ja": "指示用の電気的，磁気的手段を含んでいるもの",
      "en": "involving electric or magnetic means for indicating",
      "count": 8550,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L3/12": {
      "code": "G01L3/12",
      "level": 4,
      "parent": "G01L3/10",
      "ja": "光電手段を含んでいるもの",
      "en": "involving photoelectric means",
      "count": 626,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L3/14": {
      "code": "G01L3/14",
      "level": 2,
      "parent": "G01L3/02",
      "ja": "トルク伝達要素がねじりたわみ軸以外のものからなるもの",
      "en": "wherein the torque-transmitting element is other than a torsionally-flexible shaft",
      "count": 2349,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L3/16": {
      "code": "G01L3/16",
      "level": 1,
      "parent": "G01L3/00",
      "ja": "回転吸収式動力計，例．制動型動力計",
      "en": "Rotary-absorption dynamometers, e.g. of brake type",
      "count": 595,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L3/18": {
      "code": "G01L3/18",
      "level": 2,
      "parent": "G01L3/16",
      "ja": "機械的に作動されるもの",
      "en": "mechanically actuated",
      "count": 260,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L3/20": {
      "code": "G01L3/20",
      "level": 2,
      "parent": "G01L3/16",
      "ja": "流体によって作動されるもの",
      "en": "fluid actuated",
      "count": 518,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L3/22": {
      "code": "G01L3/22",
      "level": 2,
      "parent": "G01L3/16",
      "ja": "電気的または磁気的に作動されるもの",
      "en": "electrically or magnetically actuated",
      "count": 899,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L3/24": {
      "code": "G01L3/24",
      "level": 1,
      "parent": "G01L3/00",
      "ja": "動力の値を決定する装置，例．トルクの値と単位時間当りの回転数を測定しかつ同時に掛算することによるもの，けん引力または推進力の大きさと速度との掛算によるもの",
      "en": "Devices for determining the value of power, e.g. by measuring and simultaneously multiplying the values of torque and revolutions per unit of time, by multiplying the values of tractive or propulsive force and velocity",
      "count": 2933,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L3/26": {
      "code": "G01L3/26",
      "level": 1,
      "parent": "G01L3/00",
      "ja": "効率，すなわち動力の入力と動力の出力との比を測定する装置",
      "en": "Devices for measuring efficiency, i.e. the ratio of power output to power input",
      "count": 715,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/00": {
      "code": "G01L5/00",
      "level": 0,
      "parent": "G01L",
      "ja": "特定の目的に特に適合した，力，仕事，機械的動力またはトルクを測定する装置または方法［２００６．０１］",
      "en": "Apparatus for, or methods of, measuring force, work, mechanical power, or torque, specially adapted for specific purposes",
      "count": 46096,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/03": {
      "code": "G01L5/03",
      "level": 1,
      "parent": "G01L5/00",
      "ja": "スキーのセーフティビンディングの解放力を測定するもの",
      "en": "for measuring release force of ski safety bindings",
      "count": 87,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/04": {
      "code": "G01L5/04",
      "level": 1,
      "parent": "G01L5/00",
      "ja": "可撓性部材，例．ロープ，ケーブル，線条，糸，ベルトまたは帯の張力を測定するもの［２００６．０１］",
      "en": "for measuring tension in flexible members, e.g. ropes, cables, wires, threads, belts or bands",
      "count": 6387,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/06": {
      "code": "G01L5/06",
      "level": 2,
      "parent": "G01L5/04",
      "ja": "機械的手段を用いるもの",
      "en": "using mechanical means",
      "count": 1353,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/08": {
      "code": "G01L5/08",
      "level": 2,
      "parent": "G01L5/04",
      "ja": "流体を用いるもの",
      "en": "using fluid means",
      "count": 369,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/10": {
      "code": "G01L5/10",
      "level": 2,
      "parent": "G01L5/04",
      "ja": "電気的手段を用いるもの［２０２０．０１］",
      "en": "using electrical means",
      "count": 3078,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/101": {
      "code": "G01L5/101",
      "level": 3,
      "parent": "G01L5/10",
      "ja": "可撓性部材に挿入されたセンサを用いるもの［２０２０．０１］",
      "en": "using sensors inserted into the flexible member",
      "count": 99,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/102": {
      "code": "G01L5/102",
      "level": 3,
      "parent": "G01L5/10",
      "ja": "可撓性部材の不断部分に取り付けられたセンサを用いるもの［２０２０．０１］",
      "en": "using sensors located at a non-interrupted part of the flexible member",
      "count": 146,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/103": {
      "code": "G01L5/103",
      "level": 3,
      "parent": "G01L5/10",
      "ja": "可撓性部材の一端に固定されたセンサを用いるもの［２０２０．０１］",
      "en": "using sensors fixed at one end of the flexible member",
      "count": 79,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/105": {
      "code": "G01L5/105",
      "level": 3,
      "parent": "G01L5/10",
      "ja": "電気光学的手段を用いるもの［２０２０．０１］",
      "en": "using electro-optical means",
      "count": 87,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/106": {
      "code": "G01L5/106",
      "level": 3,
      "parent": "G01L5/10",
      "ja": "片持ちばりに加えられる反力を測定するためのもの［２０２０．０１］",
      "en": "for measuring a reaction force applied on a cantilever beam",
      "count": 24,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/107": {
      "code": "G01L5/107",
      "level": 3,
      "parent": "G01L5/10",
      "ja": "二つの支持部材，例．複数のローラまたは滑り，間に配置された要素に加えられる反力を測定するためのもの［２０２０．０１］",
      "en": "for measuring a reaction force applied on an element disposed between two supports, e.g. on a plurality of rollers or gliders",
      "count": 111,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/108": {
      "code": "G01L5/108",
      "level": 3,
      "parent": "G01L5/10",
      "ja": "一つの支持部材，例．滑り，に配置された要素に加えられる反力を測定するためのもの［２０２０．０１］",
      "en": "for measuring a reaction force applied on a single support, e.g. a glider",
      "count": 61,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/12": {
      "code": "G01L5/12",
      "level": 1,
      "parent": "G01L5/00",
      "ja": "回転軸の軸方向押力を測定するもの，例．推進装置におけるもの",
      "en": "for measuring axial thrust in a rotary shaft, e.g. of propulsion plants",
      "count": 1079,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/13": {
      "code": "G01L5/13",
      "level": 1,
      "parent": "G01L5/00",
      "ja": "乗物のけん引力または推進力を測定するもの",
      "en": "for measuring the tractive or propulsive power of vehicles",
      "count": 1472,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/14": {
      "code": "G01L5/14",
      "level": 1,
      "parent": "G01L5/00",
      "ja": "爆発力を測定するもの；発射体のエネルギーを測定するもの",
      "en": "for measuring the force of explosions; for measuring the energy of projectiles",
      "count": 856,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/16": {
      "code": "G01L5/16",
      "level": 1,
      "parent": "G01L5/00",
      "ja": "力の複数分力を測定するもの［２０２０．０１］",
      "en": "for measuring several components of force",
      "count": 5183,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/161": {
      "code": "G01L5/161",
      "level": 2,
      "parent": "G01L5/16",
      "ja": "オーム抵抗の変化を用いるもの［２０２０．０１］",
      "en": "using variations in ohmic resistance",
      "count": 159,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/162": {
      "code": "G01L5/162",
      "level": 3,
      "parent": "G01L5/161",
      "ja": "ピエゾ抵抗を用いるもの［２０２０．０１］",
      "en": "of piezoresistors",
      "count": 174,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/1623": {
      "code": "G01L5/1623",
      "level": 3,
      "parent": "G01L5/161",
      "ja": "感圧導電体を用いるもの（ピエゾ抵抗を用いるものＧ０１Ｌ５／１６２）［２０２０．０１］",
      "en": "of pressure sensitive conductors(using piezoresistors <b>G01L5/162</b>)",
      "count": 67,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/1627": {
      "code": "G01L5/1627",
      "level": 3,
      "parent": "G01L5/161",
      "ja": "抵抗ストレンゲージを用いるもの（ピエゾ抵抗を用いるものＧ０１Ｌ５／１６２）［２０２０．０１］",
      "en": "of strain gauges(using piezoresistors <b>G01L5/162</b>)",
      "count": 737,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/163": {
      "code": "G01L5/163",
      "level": 3,
      "parent": "G01L5/161",
      "ja": "ポテンショメータを用いるもの［２０２０．０１］",
      "en": "of potentiometers",
      "count": 7,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/164": {
      "code": "G01L5/164",
      "level": 2,
      "parent": "G01L5/16",
      "ja": "インダクタンスの変化を用いるもの［２０２０．０１］",
      "en": "using variations in inductance",
      "count": 59,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/165": {
      "code": "G01L5/165",
      "level": 2,
      "parent": "G01L5/16",
      "ja": "キャパシタンスの変化を用いるもの［２０２０．０１］",
      "en": "using variations in capacitance",
      "count": 298,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/166": {
      "code": "G01L5/166",
      "level": 2,
      "parent": "G01L5/16",
      "ja": "光電的手段を用いるもの［２０２０．０１］",
      "en": "using photoelectric means",
      "count": 202,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/167": {
      "code": "G01L5/167",
      "level": 2,
      "parent": "G01L5/16",
      "ja": "圧電手段を用いるもの［２０２０．０１］",
      "en": "using piezoelectric means",
      "count": 220,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/168": {
      "code": "G01L5/168",
      "level": 2,
      "parent": "G01L5/16",
      "ja": "平衡力を用いるもの［２０２０．０１］",
      "en": "using counterbalancing forces",
      "count": 21,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/169": {
      "code": "G01L5/169",
      "level": 2,
      "parent": "G01L5/16",
      "ja": "磁気的手段を用いるもの［２０２０．０１］",
      "en": "using magnetic means",
      "count": 174,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/171": {
      "code": "G01L5/171",
      "level": 2,
      "parent": "G01L5/16",
      "ja": "流体的手段を用いるもの［２０２０．０１］",
      "en": "using fluid means",
      "count": 31,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/173": {
      "code": "G01L5/173",
      "level": 2,
      "parent": "G01L5/16",
      "ja": "音響的手段を用いるもの［２０２０．０１］",
      "en": "using acoustic means",
      "count": 40,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/18": {
      "code": "G01L5/18",
      "level": 1,
      "parent": "G01L5/00",
      "ja": "力の比を測定するもの",
      "en": "for measuring ratios of force",
      "count": 183,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/20": {
      "code": "G01L5/20",
      "level": 1,
      "parent": "G01L5/00",
      "ja": "車輪の側圧を測定するもの",
      "en": "for measuring wheel side-thrust",
      "count": 329,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/22": {
      "code": "G01L5/22",
      "level": 1,
      "parent": "G01L5/00",
      "ja": "制御部材，例．乗物の制御部材，引き金，に加えられる力を測定するもの",
      "en": "for measuring the force applied to control members, e.g. control members of vehicles, triggers",
      "count": 4242,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/24": {
      "code": "G01L5/24",
      "level": 1,
      "parent": "G01L5/00",
      "ja": "ナットまたは類似応力が加わるその他の部材を締め付けるトルクまたはねじりモーメントの値を測定するもの",
      "en": "for determining value of torque or twisting moment for tightening a nut or other member which is similarly stressed",
      "count": 5522,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/26": {
      "code": "G01L5/26",
      "level": 1,
      "parent": "G01L5/00",
      "ja": "単位時間当りの回転数に関連したトルク特性を測定するもの",
      "en": "for determining the characteristic of torque in relation to revolutions per unit of time",
      "count": 238,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L5/28": {
      "code": "G01L5/28",
      "level": 1,
      "parent": "G01L5/00",
      "ja": "ブレーキを試験するもの",
      "en": "for testing brakes",
      "count": 3677,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L7/00": {
      "code": "G01L7/00",
      "level": 0,
      "parent": "G01L",
      "ja": "機械的または流体的感圧素子による流体または流動性固体の定常圧または準定常圧の測定（電気的または磁気的手段による機械的感圧素子の変位の伝達または指示Ｇ０１Ｌ９／００；２以上の圧力の差の測定Ｇ０１Ｌ１３／００；２以上の圧力の同時測定Ｇ０１Ｌ１５／００）",
      "en": "Measuring the steady or quasi-steady pressure of a fluid or a fluent solid material by mechanical or fluid pressure-sensitive elements(transmitting or indicating the displacement of mechanical pressure-sensitive elements by electric or magnetic means <b>G01L9/00</b>; measuring differences of two or more pressure values <b>G01L13/00</b>; measuring two or more pressure values simultaneously <b>G01L15/00</b>)",
      "count": 5817,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L7/02": {
      "code": "G01L7/02",
      "level": 1,
      "parent": "G01L7/00",
      "ja": "弾性的変形可能のゲージ形式によるもの",
      "en": "in the form of elastically-deformable gauges",
      "count": 1446,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L7/04": {
      "code": "G01L7/04",
      "level": 2,
      "parent": "G01L7/02",
      "ja": "可撓変形管形式によるもの，例．ブルドン管圧力計",
      "en": "in the form of flexible, deformable tubes, e.g. Bourdon gauges",
      "count": 2156,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L7/06": {
      "code": "G01L7/06",
      "level": 2,
      "parent": "G01L7/02",
      "ja": "ベローズ型",
      "en": "of the bellows type",
      "count": 883,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L7/08": {
      "code": "G01L7/08",
      "level": 2,
      "parent": "G01L7/02",
      "ja": "ダイアフラム型",
      "en": "of the flexible-diaphragm type",
      "count": 3937,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L7/10": {
      "code": "G01L7/10",
      "level": 2,
      "parent": "G01L7/02",
      "ja": "カプセル型",
      "en": "of the capsule type",
      "count": 614,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L7/12": {
      "code": "G01L7/12",
      "level": 3,
      "parent": "G01L7/10",
      "ja": "排気室をもつもの；アネロイド気圧計",
      "en": "with exhausted chamber; Aneroid barometers",
      "count": 228,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L7/14": {
      "code": "G01L7/14",
      "level": 4,
      "parent": "G01L7/12",
      "ja": "零点調整手段をもつもの",
      "en": "with zero-setting means",
      "count": 64,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L7/16": {
      "code": "G01L7/16",
      "level": 1,
      "parent": "G01L7/00",
      "ja": "ピストン形式によるもの",
      "en": "in the form of pistons",
      "count": 1423,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L7/18": {
      "code": "G01L7/18",
      "level": 1,
      "parent": "G01L7/00",
      "ja": "感圧媒体として液体を使用するもの，例．液柱ゲージ",
      "en": "using liquid as the pressure-sensitive medium, e.g. liquid-column gauges",
      "count": 1711,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L7/20": {
      "code": "G01L7/20",
      "level": 2,
      "parent": "G01L7/18",
      "ja": "液面上に，密閉真空室または低圧ガス室のあるもの；液柱気圧計",
      "en": "involving a closed chamber above the liquid level, the chamber being exhausted or housing low-pressure gas; Liquid barometers",
      "count": 247,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L7/22": {
      "code": "G01L7/22",
      "level": 2,
      "parent": "G01L7/18",
      "ja": "フロートをもつもの，例．浮動ベル",
      "en": "involving floats, e.g. floating bells",
      "count": 221,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L7/24": {
      "code": "G01L7/24",
      "level": 2,
      "parent": "G01L7/18",
      "ja": "部分的に液体を満した環状体の平衡によるもの",
      "en": "involving balances in the form of rings partly filled with liquid",
      "count": 151,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L9/00": {
      "code": "G01L9/00",
      "level": 0,
      "parent": "G01L",
      "ja": "電気的または磁気的感圧素子による流体または流動性固体の定常圧または準定常圧の測定；流体または流動性固体の定常圧または準定常圧の測定に用いられる機械的感圧素子の変位の電気的または磁気的手段による伝達または指示（２つ以上の圧力の差の測定Ｇ０１Ｌ１３／００；２つ以上の圧力の同時測定Ｇ０１Ｌ１５／００）",
      "en": "Measuring steady or quasi-steady pressure of a fluid or a fluent solid material by electric or magnetic pressure-sensitive elements; Transmitting or indicating the displacement of mechanical pressure-sensitive elements, used to measure the steady or quasi-steady pressure of a fluid or fluent solid material, by electric or magnetic means(measuring differences of two or more pressure values <b>G01L13/00</b>; measuring two or more pressure values simultaneously <b>G01L15/00</b>)",
      "count": 21390,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L9/02": {
      "code": "G01L9/02",
      "level": 1,
      "parent": "G01L9/00",
      "ja": "オーム抵抗の，例．ポテンショメータの，変化を利用するもの",
      "en": "by making use of variations in ohmic resistance, e.g. of potentiometers",
      "count": 1452,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L9/04": {
      "code": "G01L9/04",
      "level": 2,
      "parent": "G01L9/02",
      "ja": "抵抗ストレンゲージを使用するもの",
      "en": "of resistance strain gauges",
      "count": 7035,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L9/06": {
      "code": "G01L9/06",
      "level": 2,
      "parent": "G01L9/02",
      "ja": "圧電―抵抗装置を使用するもの",
      "en": "of piezo-resistive devices",
      "count": 2842,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L9/08": {
      "code": "G01L9/08",
      "level": 1,
      "parent": "G01L9/00",
      "ja": "圧電装置を利用するもの",
      "en": "by making use of piezoelectric devices",
      "count": 2474,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L9/10": {
      "code": "G01L9/10",
      "level": 1,
      "parent": "G01L9/00",
      "ja": "インダクタンスの変化を利用するもの",
      "en": "by making use of variations in inductance",
      "count": 768,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L9/12": {
      "code": "G01L9/12",
      "level": 1,
      "parent": "G01L9/00",
      "ja": "容量の変化を利用するもの",
      "en": "by making use of variations in capacitance",
      "count": 4813,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L9/14": {
      "code": "G01L9/14",
      "level": 1,
      "parent": "G01L9/00",
      "ja": "磁石，例．電磁石，の変位によるもの",
      "en": "involving the displacement of magnets, e.g. electromagnets",
      "count": 674,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L9/16": {
      "code": "G01L9/16",
      "level": 1,
      "parent": "G01L9/00",
      "ja": "応力の印加による物質の磁気特性の変化を利用するもの",
      "en": "by making use of variations in the magnetic properties of material resulting from the application of stress",
      "count": 612,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L9/18": {
      "code": "G01L9/18",
      "level": 1,
      "parent": "G01L9/00",
      "ja": "動電セル，すなわち応力の印加によって電圧が誘起または変化する含液セル，を使用するもの",
      "en": "by making use of electrokinetic cells, i.e. liquid-containing cells wherein an electric potential is produced or varied upon the application of stress",
      "count": 167,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L11/00": {
      "code": "G01L11/00",
      "level": 0,
      "parent": "G01L",
      "ja": "グループＧ０１Ｌ７／００またはＧ０１Ｌ９／００に分類されない手段による流体，または流動性固体の定常圧あるいは準定常圧の測定",
      "en": "Measuring steady or quasi-steady pressure of a fluid or a fluent solid material by means not provided for in group <b>G01L7/00</b> or <b>G01L9/00</b>",
      "count": 8976,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L11/02": {
      "code": "G01L11/02",
      "level": 1,
      "parent": "G01L11/00",
      "ja": "光学的手段によるもの［６］",
      "en": "by optical means",
      "count": 2729,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L11/04": {
      "code": "G01L11/04",
      "level": 1,
      "parent": "G01L11/00",
      "ja": "音波的手段によるもの［６］",
      "en": "by acoustic means",
      "count": 358,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L11/06": {
      "code": "G01L11/06",
      "level": 2,
      "parent": "G01L11/04",
      "ja": "超音波手段［２００６．０１］",
      "en": "Ultrasonic means",
      "count": 221,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L13/00": {
      "code": "G01L13/00",
      "level": 0,
      "parent": "G01L",
      "ja": "２以上の流体圧力の差を測定する装置",
      "en": "Devices or apparatus for measuring differences of two or more fluid pressure values",
      "count": 3982,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L13/02": {
      "code": "G01L13/02",
      "level": 1,
      "parent": "G01L13/00",
      "ja": "感圧素子として弾性的に変形可能な部材またはピストンを用いるもの",
      "en": "using elastically-deformable members or pistons as sensing elements",
      "count": 3519,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L13/04": {
      "code": "G01L13/04",
      "level": 1,
      "parent": "G01L13/00",
      "ja": "感圧素子としてフロートまたは液体を用いるもの",
      "en": "using floats or liquids as sensing elements",
      "count": 270,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L13/06": {
      "code": "G01L13/06",
      "level": 1,
      "parent": "G01L13/00",
      "ja": "電気的または磁気的感圧素子を用いるもの",
      "en": "using electric or magnetic pressure-sensitive elements",
      "count": 1892,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L15/00": {
      "code": "G01L15/00",
      "level": 0,
      "parent": "G01L",
      "ja": "２以上の流体圧力を同時に測定する装置",
      "en": "Devices or apparatus for measuring two or more fluid pressure values simultaneously",
      "count": 1440,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L17/00": {
      "code": "G01L17/00",
      "level": 0,
      "parent": "G01L",
      "ja": "タイヤ内圧またはその他の膨脹体の内圧を測定する装置",
      "en": "Devices or apparatus for measuring tyre pressure or the pressure in other inflated bodies",
      "count": 5692,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L19/00": {
      "code": "G01L19/00",
      "level": 0,
      "parent": "G01L",
      "ja": "流動体の定常圧または準定常圧測定装置の細部または付属品であって，特定形式の圧力計に限定されないもの",
      "en": "Details of, or accessories for, apparatus for measuring steady or quasi-steady pressure of a fluent medium insofar as such details or accessories are not special to particular types of pressure gauges",
      "count": 20164,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L19/02": {
      "code": "G01L19/02",
      "level": 1,
      "parent": "G01L19/00",
      "ja": "測定装置の傾斜または加速度の影響を防止または補償する装置；零点調整手段（アネロイド気圧計用Ｇ０１Ｌ７／１４）",
      "en": "Arrangements for preventing, or for compensating for, effects of inclination or acceleration of the measuring device; Zero-setting means(for aneroid barometers <b>G01L7/14</b>)",
      "count": 676,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L19/04": {
      "code": "G01L19/04",
      "level": 1,
      "parent": "G01L19/00",
      "ja": "温度変化の影響を補償する手段",
      "en": "Means for compensating for effects of changes of temperature",
      "count": 3041,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L19/06": {
      "code": "G01L19/06",
      "level": 1,
      "parent": "G01L19/00",
      "ja": "過負荷または被測定体が測定装置におよぼすあるいはその逆におよぼす悪影響を防止する手段",
      "en": "Means for preventing overload or deleterious influence of the measured medium on the measuring device or <u>vice versa</u>",
      "count": 9160,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L19/08": {
      "code": "G01L19/08",
      "level": 1,
      "parent": "G01L19/00",
      "ja": "指示または記録手段，例．遠隔指示のためのもの",
      "en": "Means for indicating or recording, e.g. for remote indication",
      "count": 5141,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L19/10": {
      "code": "G01L19/10",
      "level": 2,
      "parent": "G01L19/08",
      "ja": "機械的なもの",
      "en": "mechanical",
      "count": 791,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L19/12": {
      "code": "G01L19/12",
      "level": 2,
      "parent": "G01L19/08",
      "ja": "警報または信号",
      "en": "Alarms or signals",
      "count": 3333,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L19/14": {
      "code": "G01L19/14",
      "level": 1,
      "parent": "G01L19/00",
      "ja": "ハウジング",
      "en": "Housings",
      "count": 8064,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L19/16": {
      "code": "G01L19/16",
      "level": 1,
      "parent": "G01L19/00",
      "ja": "ダイアル；その取付け",
      "en": "Dials; Mounting of dials",
      "count": 544,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L21/00": {
      "code": "G01L21/00",
      "level": 0,
      "parent": "G01L",
      "ja": "真空計",
      "en": "Vacuum gauges",
      "count": 2577,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L21/02": {
      "code": "G01L21/02",
      "level": 1,
      "parent": "G01L21/00",
      "ja": "被測圧ガスを圧縮する圧縮室をもつもの",
      "en": "having a compression chamber in which gas, whose pressure is to be measured, is compressed",
      "count": 168,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L21/04": {
      "code": "G01L21/04",
      "level": 2,
      "parent": "G01L21/02",
      "ja": "圧縮室が液体によって閉じられているもの；マクレオド型真空計",
      "en": "wherein the chamber is closed by liquid; Vacuum gauges of the McLeod type",
      "count": 112,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L21/06": {
      "code": "G01L21/06",
      "level": 3,
      "parent": "G01L21/04",
      "ja": "測定装置の回転または反転によって作動されるもの",
      "en": "actuated by rotating or inverting the measuring device",
      "count": 16,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L21/08": {
      "code": "G01L21/08",
      "level": 1,
      "parent": "G01L21/00",
      "ja": "被測圧媒体を通る音波の伝達状態の変化の測定によるもの",
      "en": "by measuring variations in the transmission of acoustic waves through the medium, the pressure of which is to be measured",
      "count": 57,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L21/10": {
      "code": "G01L21/10",
      "level": 1,
      "parent": "G01L21/00",
      "ja": "被測圧媒体の熱伝導率の変化の測定によるもの",
      "en": "by measuring variations in the heat conductivity of the medium, the pressure of which is to be measured",
      "count": 149,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L21/12": {
      "code": "G01L21/12",
      "level": 2,
      "parent": "G01L21/10",
      "ja": "測定部材，例．フィラメント，の電気抵抗の変化を測定するもの；ピラニ型真空計",
      "en": "measuring changes in electric resistance of measuring members, e.g. of filaments; Vacuum gauges of the Pirani type",
      "count": 478,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L21/14": {
      "code": "G01L21/14",
      "level": 2,
      "parent": "G01L21/10",
      "ja": "熱電対を用いるもの",
      "en": "using thermocouples",
      "count": 117,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L21/16": {
      "code": "G01L21/16",
      "level": 1,
      "parent": "G01L21/00",
      "ja": "ガスの摩擦抵抗の変化の測定によるもの",
      "en": "by measuring variation of frictional resistance of gases",
      "count": 28,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L21/18": {
      "code": "G01L21/18",
      "level": 2,
      "parent": "G01L21/16",
      "ja": "振り子を用いるもの",
      "en": "using a pendulum",
      "count": 5,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L21/20": {
      "code": "G01L21/20",
      "level": 2,
      "parent": "G01L21/16",
      "ja": "垂直軸のまわりに振動する部材を用いるもの",
      "en": "using members oscillating about a vertical axis",
      "count": 6,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L21/22": {
      "code": "G01L21/22",
      "level": 2,
      "parent": "G01L21/16",
      "ja": "振動体の共振効果を利用するもの；クラム型真空計",
      "en": "using resonance effects of a vibrating body; Vacuum gauges of the Klumb type",
      "count": 114,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L21/24": {
      "code": "G01L21/24",
      "level": 2,
      "parent": "G01L21/16",
      "ja": "回転部材を用いるもの；ラングミュアー型真空計",
      "en": "using rotating members; Vacuum gauges of the Langmuir type",
      "count": 42,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L21/26": {
      "code": "G01L21/26",
      "level": 1,
      "parent": "G01L21/00",
      "ja": "輻射計の機能，すなわちホッタからクーラへ流れる分子の運動量によって発生する圧力，を利用するもの；クヌードセン型真空計",
      "en": "by making use of radiometer action, i.e. of the pressure caused by the momentum of molecules passing from a hotter to a cooler member; Vacuum gauges of the Knudsen type",
      "count": 26,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L21/28": {
      "code": "G01L21/28",
      "level": 2,
      "parent": "G01L21/26",
      "ja": "ねじり回転測定部材を用いるもの",
      "en": "using torsional rotary measuring members",
      "count": 2,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L21/30": {
      "code": "G01L21/30",
      "level": 1,
      "parent": "G01L21/00",
      "ja": "イオン化効果を利用するもの",
      "en": "by making use of ionisation effects",
      "count": 730,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L21/32": {
      "code": "G01L21/32",
      "level": 2,
      "parent": "G01L21/30",
      "ja": "熱陰極放電管を用いるもの",
      "en": "using electric discharge tubes with thermionic cathodes",
      "count": 291,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L21/34": {
      "code": "G01L21/34",
      "level": 2,
      "parent": "G01L21/30",
      "ja": "冷陰極放電管を用いるもの",
      "en": "using electric discharge tubes with cold cathodes",
      "count": 317,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L21/36": {
      "code": "G01L21/36",
      "level": 2,
      "parent": "G01L21/30",
      "ja": "放射性物質を用いるもの",
      "en": "using radioactive substances",
      "count": 31,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L23/00": {
      "code": "G01L23/00",
      "level": 0,
      "parent": "G01L",
      "ja": "蒸気，ガス，または液体の圧力における振動のような急激な変化を測定，指示または記録する装置；作業流体の状態から蒸気機関，内燃機関またはその他の流体圧機関の仕事またはエネルギーを決定する指示器",
      "en": "Devices or apparatus for measuring or indicating or recording rapid changes, such as oscillations, in the pressure of steam, gas, or liquid; Indicators for determining work or energy of steam, internal-combustion, or other fluid-pressure engines from the condition of the working fluid",
      "count": 1106,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L23/02": {
      "code": "G01L23/02",
      "level": 1,
      "parent": "G01L23/00",
      "ja": "負荷または復帰スプリングを含む機械的指示または記録",
      "en": "mechanically indicating or recording and involving loaded or return springs",
      "count": 288,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L23/04": {
      "code": "G01L23/04",
      "level": 1,
      "parent": "G01L23/00",
      "ja": "既知反作用圧の支配を受ける手段を含むもの",
      "en": "involving means subjected to known counteracting pressure",
      "count": 63,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L23/06": {
      "code": "G01L23/06",
      "level": 1,
      "parent": "G01L23/00",
      "ja": "光学的手段による指示または記録",
      "en": "Indicating or recording by optical means",
      "count": 156,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L23/08": {
      "code": "G01L23/08",
      "level": 1,
      "parent": "G01L23/00",
      "ja": "電気的に作動するもの",
      "en": "operated electrically",
      "count": 705,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L23/10": {
      "code": "G01L23/10",
      "level": 2,
      "parent": "G01L23/08",
      "ja": "圧電型の感圧部材によるもの",
      "en": "by pressure-sensitive members of the piezoelectric type",
      "count": 1273,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L23/12": {
      "code": "G01L23/12",
      "level": 2,
      "parent": "G01L23/08",
      "ja": "容量またはインダクタンスの変化によるもの",
      "en": "by changing capacitance or inductance",
      "count": 178,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L23/14": {
      "code": "G01L23/14",
      "level": 2,
      "parent": "G01L23/08",
      "ja": "電磁的素子によるもの",
      "en": "by electromagnetic elements",
      "count": 70,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L23/16": {
      "code": "G01L23/16",
      "level": 2,
      "parent": "G01L23/08",
      "ja": "光電的手段によるもの",
      "en": "by photoelectric means",
      "count": 148,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L23/18": {
      "code": "G01L23/18",
      "level": 2,
      "parent": "G01L23/08",
      "ja": "抵抗ストレンゲージによるもの",
      "en": "by resistance strain gauges",
      "count": 449,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L23/20": {
      "code": "G01L23/20",
      "level": 1,
      "parent": "G01L23/00",
      "ja": "面積計または積分器と結合したもの",
      "en": "combined with planimeters or integrators",
      "count": 49,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L23/22": {
      "code": "G01L23/22",
      "level": 1,
      "parent": "G01L23/00",
      "ja": "内燃機関のノックを検出または指示するもの；内燃機関を点火する点火栓と組み合わされた感圧部材をもつユニット",
      "en": "for detecting or indicating knocks in internal-combustion engines; Units comprising pressure-sensitive members combined with ignitors for firing internal-combustion engines",
      "count": 3007,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L23/24": {
      "code": "G01L23/24",
      "level": 1,
      "parent": "G01L23/00",
      "ja": "内燃機関の吸気または排気ダクトの圧力を測定するもの",
      "en": "for measuring pressure in inlet or exhaust ducts of internal-combustion engines",
      "count": 752,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L23/26": {
      "code": "G01L23/26",
      "level": 1,
      "parent": "G01L23/00",
      "ja": "細部または付属品",
      "en": "Details or accessories",
      "count": 604,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L23/28": {
      "code": "G01L23/28",
      "level": 2,
      "parent": "G01L23/26",
      "ja": "冷却手段",
      "en": "Cooling means",
      "count": 99,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L23/30": {
      "code": "G01L23/30",
      "level": 2,
      "parent": "G01L23/26",
      "ja": "指圧計と組み合わされた内燃機関のピストンまたはクランクの連続的位置指示手段",
      "en": "Means for indicating consecutively positions of pistons or cranks of internal-combustion engines in combination with pressure indicators",
      "count": 139,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L23/32": {
      "code": "G01L23/32",
      "level": 2,
      "parent": "G01L23/26",
      "ja": "指示計で測定された圧力変化の記録に特に適合する装置",
      "en": "Apparatus specially adapted for recording pressure changes measured by indicators",
      "count": 148,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L25/00": {
      "code": "G01L25/00",
      "level": 0,
      "parent": "G01L",
      "ja": "力，トルク，仕事，機械的動力または機械的効率を測定する装置の試験または較正［２］",
      "en": "Testing or calibrating of apparatus for measuring force, torque, work, mechanical power, or mechanical efficiency",
      "count": 8711,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L27/00": {
      "code": "G01L27/00",
      "level": 0,
      "parent": "G01L",
      "ja": "流体圧力測定装置の試験または較正［２］",
      "en": "Testing or calibrating of apparatus for measuring fluid pressure",
      "count": 9326,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    },
    "G01L27/02": {
      "code": "G01L27/02",
      "level": 1,
      "parent": "G01L27/00",
      "ja": "指示器の",
      "en": "of indicators",
      "count": 242,
      "sourceFile": "ipc_G01L.txt",
      "kind": "ipc"
    }
  }
};
