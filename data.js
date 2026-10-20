/**
 * Tabla Cronoestratigráfica Internacional (Versión Oficial ICS 2023/09)
 * Comisión Internacional de Estratigrafía (IUGS - International Commission on Stratigraphy)
 * Datos completos con colores oficiales, límites en Ma, eventos biológicos y fósiles guía.
 */

const CHRONO_DATA = {
  eons: [
    {
      id: "phanerozoic",
      nombre: "Fanerozoico",
      rango: "538.8 Ma - Presente",
      inicioMa: 538.8,
      finMa: 0,
      color: "#9FE2BF",
      descripcion: "El eón de la 'vida visible', caracterizado por la abundancia de fósiles con partes duras y gran biodiversidad.",
      eras: [
        {
          id: "cenozoic",
          nombre: "Cenozoico",
          rango: "66.0 Ma - Presente",
          inicioMa: 66.0,
          finMa: 0,
          color: "#F2F91D",
          textColor: "#333333",
          descripcion: "'Era de los mamíferos' y de las angiospermas tras la extinción masiva del límite K-Pg.",
          periodos: [
            {
              id: "quaternary",
              nombre: "Cuaternario",
              rango: "2.58 Ma - Presente",
              inicioMa: 2.58,
              finMa: 0,
              color: "#F9F97F",
              textColor: "#333333",
              descripcion: "El Cuaternario es el período más reciente del Cenozoico (2.58 Ma - Presente), caracterizado por los ciclos glaciares e interglaciares, la evolución y dispersión del género Homo (Homo sapiens) y la configuración de la biosfera moderna.",
              subdivisiones: [
                {
                  epoca: "Holoceno",
                  rango: "0.0117 Ma - Presente",
                  pisos: [
                    { nombre: "Megalayense", rango: "0.0042 Ma - Actual", gssp: true },
                    { nombre: "Norgripiense", rango: "0.0082 - 0.0042 Ma", gssp: true },
                    { nombre: "Groenlandiense", rango: "0.0117 - 0.0082 Ma", gssp: true }
                  ]
                },
                {
                  epoca: "Pleistoceno",
                  rango: "2.58 - 0.0117 Ma",
                  pisos: [
                    { nombre: "Tarantiense (Superior)", rango: "0.129 - 0.0117 Ma" },
                    { nombre: "Chibaniense (Medio)", rango: "0.774 - 0.129 Ma", gssp: true },
                    { nombre: "Calabriense", rango: "1.80 - 0.774 Ma", gssp: true },
                    { nombre: "Gelasiense", rango: "2.58 - 1.80 Ma", gssp: true }
                  ]
                }
              ],
              epocas: ["Holoceno (0.0117 Ma - hoy)", "Pleistoceno (2.58 - 0.0117 Ma)"],
              edadesDestacadas: ["Megalayense (actual)", "Norgripiense", "Groenlandiense", "Tarantiense", "Chibaniense", "Calabriense", "Gelasiense"],
              fosiles: "Homo sapiens, Mamuts, Smilodon (Dientes de sable)",
              hitos: "Glaciaciones sucesivas, evolución y dispersión del género Homo, desarrollo de la agricultura y la civilización.",
              mnemotecnia: "Cuaternario = Cuatro pasos de la humanidad reciente."
            },
            {
              id: "neogene",
              nombre: "Neógeno",
              rango: "23.03 - 2.58 Ma",
              inicioMa: 23.03,
              finMa: 2.58,
              color: "#FFE619",
              textColor: "#333333",
              descripcion: "El Neógeno (23.03 - 2.58 Ma) presenció una intensa continentalización climática, la expansión masiva de praderas de gramíneas, la radiación de grandes mamíferos (Hipparion, Megalodón) y el surgimiento de los primeros homínidos bípedos (Australopithecus).",
              subdivisiones: [
                {
                  epoca: "Plioceno",
                  rango: "5.333 - 2.58 Ma",
                  pisos: [
                    { nombre: "Piacenziense", rango: "3.60 - 2.58 Ma", gssp: true },
                    { nombre: "Zancleense", rango: "5.333 - 3.60 Ma", gssp: true }
                  ]
                },
                {
                  epoca: "Mioceno",
                  rango: "23.03 - 5.333 Ma",
                  pisos: [
                    { nombre: "Messiniense", rango: "7.246 - 5.333 Ma", gssp: true },
                    { nombre: "Tortoniense", rango: "11.63 - 7.246 Ma", gssp: true },
                    { nombre: "Serravalliense", rango: "13.82 - 11.63 Ma", gssp: true },
                    { nombre: "Langhiense", rango: "15.98 - 13.82 Ma" },
                    { nombre: "Burdigaliense", rango: "20.44 - 15.98 Ma" },
                    { nombre: "Aquitaniense", rango: "23.03 - 20.44 Ma", gssp: true }
                  ]
                }
              ],
              epocas: ["Plioceno (5.333 - 2.58 Ma)", "Mioceno (23.03 - 5.333 Ma)"],
              edadesDestacadas: ["Piacenziense", "Zancleense", "Messiniense", "Tortoniense", "Serravalliense", "Langhiense", "Burdigaliense", "Aquitaniense"],
              fosiles: "Australopithecus, Megalodón, Hipparion",
              hitos: "Aparición de los primeros homínidos bípedos, crisis de salinidad del Messiniense en el mar Mediterráneo.",
              mnemotecnia: "Neógeno = 'Neo' (Nuevo) - Nacen los primeros homínidos."
            },
            {
              id: "paleogene",
              nombre: "Paleógeno",
              rango: "66.0 - 23.03 Ma",
              inicioMa: 66.0,
              finMa: 23.03,
              color: "#FD9A52",
              textColor: "#222222",
              descripcion: "El Paleógeno (66.0 - 23.03 Ma) comenzó inmediatamente tras la extinción masiva del límite K-Pg a 66.0 Ma. Los mamíferos experimentaron una radiación adaptativa explosiva, poblando continentes y océanos (Basilosaurus). Se produjo el Máximo Térmico del Paleoceno-Eoceno (PETM).",
              subdivisiones: [
                {
                  epoca: "Oligoceno",
                  rango: "33.9 - 23.03 Ma",
                  pisos: [
                    { nombre: "Chattiense", rango: "27.82 - 23.03 Ma" },
                    { nombre: "Rupeliense", rango: "33.9 - 27.82 Ma", gssp: true }
                  ]
                },
                {
                  epoca: "Eoceno",
                  rango: "56.0 - 33.9 Ma",
                  pisos: [
                    { nombre: "Priaboniense", rango: "37.71 - 33.9 Ma", gssp: true },
                    { nombre: "Bartoniense", rango: "41.2 - 37.71 Ma" },
                    { nombre: "Luteciense", rango: "47.8 - 41.2 Ma", gssp: true },
                    { nombre: "Ypresiense", rango: "56.0 - 47.8 Ma", gssp: true }
                  ]
                },
                {
                  epoca: "Paleoceno",
                  rango: "66.0 - 56.0 Ma",
                  pisos: [
                    { nombre: "Thanetiense", rango: "59.2 - 56.0 Ma", gssp: true },
                    { nombre: "Selandiense", rango: "61.6 - 59.2 Ma", gssp: true },
                    { nombre: "Daniense", rango: "66.0 - 61.6 Ma", gssp: true }
                  ]
                }
              ],
              epocas: ["Oligoceno (33.9 - 23.03 Ma)", "Eoceno (56.0 - 33.9 Ma)", "Paleoceno (66.0 - 56.0 Ma)"],
              edadesDestacadas: ["Chattiense", "Rupeliense", "Priaboniense", "Bartoniense", "Luteciense", "Ypresiense", "Thanetiense", "Selandiense", "Daniense"],
              fosiles: "Nummulites, Basilosaurus (primeras ballenas), Hyracotherium",
              hitos: "Máximo Térmico del Paleoceno-Eoceno (PETM), radiación explosiva de mamíferos placentarios y aves modernas.",
              mnemotecnia: "Paleógeno = 'Paleo' antiguo cenozoico (Paleoceno, Eoceno, Oligoceno)."
            }
          ]
        },
        {
          id: "mesozoic",
          nombre: "Mesozoico",
          rango: "251.9 - 66.0 Ma",
          inicioMa: 251.9,
          finMa: 66.0,
          color: "#34B2C9",
          textColor: "#ffffff",
          descripcion: "'Era de los reptiles y dinosaurios'. Clima cálido, fragmentación de Pangea y aparición de las primeras aves y mamíferos.",
          periodos: [
            {
              id: "cretaceous",
              nombre: "Cretácico",
              rango: "145.0 - 66.0 Ma",
              inicioMa: 145.0,
              finMa: 66.0,
              color: "#7FC64E",
              textColor: "#111111",
              descripcion: "El Cretácico (145.0 - 66.0 Ma) es el último y más largo período del Mesozoico. Se formaron extensos mares cálidos con calizas de tiza. Dominado por dinosaurios como Tyrannosaurus rex y Triceratops, hasta el impacto de Chicxulub a 66.0 Ma que provocó la extinción masiva del límite K-Pg.",
              subdivisiones: [
                {
                  epoca: "Cretácico Superior",
                  rango: "100.5 - 66.0 Ma",
                  pisos: [
                    { nombre: "Maastrichtiense", rango: "72.1 - 66.0 Ma", gssp: true },
                    { nombre: "Campaniense", rango: "83.6 - 72.1 Ma" },
                    { nombre: "Santoniense", rango: "86.3 - 83.6 Ma", gssp: true },
                    { nombre: "Coniaciense", rango: "89.8 - 86.3 Ma" },
                    { nombre: "Turoniense", rango: "93.9 - 89.8 Ma", gssp: true },
                    { nombre: "Cenomaniense", rango: "100.5 - 93.9 Ma", gssp: true }
                  ]
                },
                {
                  epoca: "Cretácico Inferior",
                  rango: "145.0 - 100.5 Ma",
                  pisos: [
                    { nombre: "Albiense", rango: "113.0 - 100.5 Ma", gssp: true },
                    { nombre: "Aptiense", rango: "121.4 - 113.0 Ma" },
                    { nombre: "Barremiense", rango: "125.77 - 121.4 Ma" },
                    { nombre: "Hauteriviense", rango: "132.6 - 125.77 Ma", gssp: true },
                    { nombre: "Valanginiense", rango: "139.8 - 132.6 Ma" },
                    { nombre: "Berriasiense", rango: "145.0 - 139.8 Ma" }
                  ]
                }
              ],
              epocas: ["Cretácico Superior (100.5 - 66.0 Ma)", "Cretácico Inferior (145.0 - 100.5 Ma)"],
              edadesDestacadas: ["Maastrichtiense", "Campaniense", "Santoniense", "Coniaciense", "Turoniense", "Cenomaniense", "Albiense", "Aptiense", "Barremiense", "Hauteriviense", "Valanginiense", "Berriasiense"],
              fosiles: "Tyrannosaurus rex, Triceratops, Rudistas, Belemnites",
              hitos: "Aparición y explosión de las plantas con flores (angiospermas). Impacto de asteroide en Chicxulub (límite K-Pg a 66 Ma) y extinción masiva.",
              mnemotecnia: "Cretácico = Creta (tiza en latín), grandes acantilados de caliza de cocolitofóridos."
            },
            {
              id: "jurassic",
              nombre: "Jurásico",
              rango: "201.4 - 145.0 Ma",
              inicioMa: 201.4,
              finMa: 145.0,
              color: "#34B2C9",
              textColor: "#ffffff",
              descripcion: "El Jurásico (201.4 - 145.0 Ma) fue el tiempo del apogeo de los grandes dinosaurios saurópodos (Braquiosaurios), la fragmentación de Pangea y la expansión de mares cálidos poblados por Ammonites y Belemnites. Aparecieron las primeras aves plumíferas como Archaeopteryx.",
              subdivisiones: [
                {
                  epoca: "Jurásico Superior (Malm)",
                  rango: "163.5 - 145.0 Ma",
                  pisos: [
                    { nombre: "Titoniense", rango: "152.1 - 145.0 Ma" },
                    { nombre: "Kimmeridgiense", rango: "157.3 - 152.1 Ma", gssp: true },
                    { nombre: "Oxfordiense", rango: "163.5 - 157.3 Ma" }
                  ]
                },
                {
                  epoca: "Jurásico Medio (Dogger)",
                  rango: "174.1 - 163.5 Ma",
                  pisos: [
                    { nombre: "Caloviense", rango: "166.1 - 163.5 Ma" },
                    { nombre: "Batoniense", rango: "168.3 - 166.1 Ma", gssp: true },
                    { nombre: "Bayociense", rango: "170.3 - 168.3 Ma", gssp: true },
                    { nombre: "Aaleniense", rango: "174.1 - 170.3 Ma", gssp: true }
                  ]
                },
                {
                  epoca: "Jurásico Inferior (Lias)",
                  rango: "201.4 - 174.1 Ma",
                  pisos: [
                    { nombre: "Toarciense", rango: "182.7 - 174.1 Ma" },
                    { nombre: "Pliensbachiense", rango: "190.8 - 182.7 Ma", gssp: true },
                    { nombre: "Sinemuriense", rango: "199.3 - 190.8 Ma", gssp: true },
                    { nombre: "Hettangiense", rango: "201.4 - 199.3 Ma", gssp: true }
                  ]
                }
              ],
              epocas: ["Jurásico Superior (Malm)", "Jurásico Medio (Dogger)", "Jurásico Inferior (Lias)"],
              edadesDestacadas: ["Titoniense", "Kimmeridgiense", "Oxfordiense", "Caloviense", "Batoniense", "Bayociense", "Aaleniense", "Toarciense", "Pliensbachiense", "Sinemuriense", "Hettangiense"],
              fosiles: "Archaeopteryx (primera ave), Braquiosaurios, Ammonites perisphinctes",
              hitos: "Apogeo de los saurópodos gigantes, primeras aves plumíferas, apertura del Océano Atlántico central.",
              mnemotecnia: "Jurásico = Montes Jura en Suiza/Francia."
            },
            {
              id: "triassic",
              nombre: "Triásico",
              rango: "251.9 - 201.4 Ma",
              inicioMa: 251.9,
              finMa: 201.4,
              color: "#812B92",
              textColor: "#ffffff",
              descripcion: "El Triásico (251.9 - 201.4 Ma) inauguró el Mesozoico tras la devastadora extinción masiva del límite P-Tr a 251.9 Ma. El clima hiperárido de Pangea impulsó la aparición de los primeros dinosaurios verdaderos (Coelophysis), mamíferos primitivos e ictiosaurios.",
              subdivisiones: [
                {
                  epoca: "Triásico Superior",
                  rango: "237.0 - 201.4 Ma",
                  pisos: [
                    { nombre: "Rhaetiense", rango: "~208.5 - 201.4 Ma" },
                    { nombre: "Noriense", rango: "~227 - ~208.5 Ma" },
                    { nombre: "Carniense", rango: "~237 - ~227 Ma", gssp: true }
                  ]
                },
                {
                  epoca: "Triásico Medio",
                  rango: "247.2 - 237.0 Ma",
                  pisos: [
                    { nombre: "Ladiniense", rango: "~242 - ~237 Ma", gssp: true },
                    { nombre: "Anisiense", rango: "247.2 - ~242 Ma", gssp: true }
                  ]
                },
                {
                  epoca: "Triásico Inferior",
                  rango: "251.9 - 247.2 Ma",
                  pisos: [
                    { nombre: "Olenekiense", rango: "251.2 - 247.2 Ma" },
                    { nombre: "Induense", rango: "251.9 - 251.2 Ma", gssp: true }
                  ]
                }
              ],
              epocas: ["Triásico Superior", "Triásico Medio", "Triásico Inferior"],
              edadesDestacadas: ["Rhaetiense", "Noriense", "Carniense", "Ladiniense", "Anisiense", "Olenekiense", "Induense"],
              fosiles: "Coelophysis, Ictiosaurios primitivos, Ceratites",
              hitos: "Recuperación de la biosfera post-extinción pérmica. Primeros dinosaurios verdaderos y primeros mamíferos.",
              mnemotecnia: "Triásico = 'Tríada' de 3 formaciones rocosas distintivas en Alemania (Buntsandstein, Muschelkalk, Keuper)."
            }
          ]
        },
        {
          id: "paleozoic",
          nombre: "Paleozoico",
          rango: "538.8 - 251.9 Ma",
          inicioMa: 538.8,
          finMa: 251.9,
          color: "#99C08D",
          textColor: "#111111",
          descripcion: "'Era de la vida antigua'. Desde la Explosión Cámbrica en los mares hasta la colonización masiva de tierra firme por plantas y vertebrados.",
          periodos: [
            {
              id: "permian",
              nombre: "Pérmico",
              rango: "298.9 - 251.9 Ma",
              inicioMa: 298.9,
              finMa: 251.9,
              color: "#F04028",
              textColor: "#ffffff",
              descripcion: "El Pérmico (298.9 - 251.9 Ma) culminó la formación de Pangea con climas continentales extremos dominados por sinápsidos (Dimetrodon). Concluyó con la 'Gran Mortandad' a 251.9 Ma (la peor extinción masiva de la historia terrestre provocada por los traps siberianos, que eliminó el 96% de las especies marinas).",
              subdivisiones: [
                {
                  epoca: "Lopingiense (Superior)",
                  rango: "259.1 - 251.9 Ma",
                  pisos: [
                    { nombre: "Changhsingiense", rango: "254.14 - 251.9 Ma", gssp: true },
                    { nombre: "Wuchiapingiense", rango: "259.1 - 254.14 Ma", gssp: true }
                  ]
                },
                {
                  epoca: "Guadalupiense (Medio)",
                  rango: "272.95 - 259.1 Ma",
                  pisos: [
                    { nombre: "Capitaniense", rango: "265.1 - 259.1 Ma", gssp: true },
                    { nombre: "Wordiense", rango: "268.8 - 265.1 Ma", gssp: true },
                    { nombre: "Roadiense", rango: "272.95 - 268.8 Ma", gssp: true }
                  ]
                },
                {
                  epoca: "Cisuraliense (Inferior)",
                  rango: "298.9 - 272.95 Ma",
                  pisos: [
                    { nombre: "Kunguriense", rango: "283.5 - 272.95 Ma" },
                    { nombre: "Artinskiense", rango: "290.1 - 283.5 Ma" },
                    { nombre: "Sakmariense", rango: "293.52 - 290.1 Ma" },
                    { nombre: "Asseliense", rango: "298.9 - 293.52 Ma", gssp: true }
                  ]
                }
              ],
              epocas: ["Lopingiense", "Guadalupiense", "Cisuraliense"],
              edadesDestacadas: ["Changhsingiense", "Wuchiapingiense", "Capitaniense", "Wordiense", "Roadiense", "Kunguriense", "Artinskiense", "Sakmariense", "Asseliense"],
              fosiles: "Dimetrodon (sinápsido), Glossopteris, Braquiópodos espiriféridos",
              hitos: "Formación del supercontinente Pangea. La mayor extinción masiva de la historia de la Tierra al final del período (~96% de especies marinas desaparecen a 251.9 Ma).",
              mnemotecnia: "Pérmico = Región de Perm (Rusia). Fin trágico de la era paleozoica."
            },
            {
              id: "carboniferous",
              nombre: "Carbonífero",
              rango: "358.9 - 298.9 Ma",
              inicioMa: 358.9,
              finMa: 298.9,
              color: "#67A599",
              textColor: "#ffffff",
              descripcion: "El Carbonífero (358.9 - 298.9 Ma) se caracterizó por descomunales bosques pantanosos de licopodios arborescentes (Lepidodendron) que generaron el carbón mineral de la Tierra. Con niveles de oxígeno atmosférico del ~35%, prosperaron artrópodos colosales (Meganeura de 70 cm) y surgió el huevo amniota adaptado a tierra firme.",
              subdivisiones: [
                {
                  epoca: "Pensilvánico (Superior)",
                  rango: "323.2 - 298.9 Ma",
                  pisos: [
                    { nombre: "Gzheliense", rango: "303.7 - 298.9 Ma" },
                    { nombre: "Kasimoviense", rango: "307.0 - 303.7 Ma" },
                    { nombre: "Moscoviense", rango: "315.2 - 307.0 Ma" },
                    { nombre: "Bashkiriense", rango: "323.2 - 315.2 Ma", gssp: true }
                  ]
                },
                {
                  epoca: "Misisípico (Inferior)",
                  rango: "358.9 - 323.2 Ma",
                  pisos: [
                    { nombre: "Serpukhoviense", rango: "330.9 - 323.2 Ma" },
                    { nombre: "Viseense", rango: "346.7 - 330.9 Ma", gssp: true },
                    { nombre: "Tournaisiense", rango: "358.9 - 346.7 Ma", gssp: true }
                  ]
                }
              ],
              epocas: ["Pensilvánico (323.2 - 298.9 Ma)", "Misisípico (358.9 - 323.2 Ma)"],
              edadesDestacadas: ["Gzheliense", "Kasimoviense", "Moscoviense", "Bashkiriense", "Serpukhoviense", "Viseense", "Tournaisiense"],
              fosiles: "Meganeura (libélula gigante de 70 cm), Lepidodendron, Fusulinas",
              hitos: "Grandes bosques de licofitas y helechos gigantes acumulados como carbón mineral. Niveles de oxígeno atmosférico alcanzan el ~35%. Primeros huevos amniotas.",
              mnemotecnia: "Carbonífero = Generador del carbón mundial y artrópodos gigantes."
            },
            {
              id: "devonian",
              nombre: "Devónico",
              rango: "419.2 - 358.9 Ma",
              inicioMa: 419.2,
              finMa: 358.9,
              color: "#CB8C37",
              textColor: "#ffffff",
              descripcion: "El Devónico (419.2 - 358.9 Ma), conocido como la 'Edad de los Peces', vio el auge de peces placodermos con pesada armadura ósea (Dunkleosteus), los primeros bosques terrestres de gran porte (Archaeopteris) y la transición crucial de peces a tetrápodos terrestres (Tiktaalik).",
              subdivisiones: [
                {
                  epoca: "Devónico Superior",
                  rango: "382.7 - 358.9 Ma",
                  pisos: [
                    { nombre: "Fameniense", rango: "372.2 - 358.9 Ma", gssp: true },
                    { nombre: "Frasniense", rango: "382.7 - 372.2 Ma", gssp: true }
                  ]
                },
                {
                  epoca: "Devónico Medio",
                  rango: "393.3 - 382.7 Ma",
                  pisos: [
                    { nombre: "Givetiense", rango: "387.7 - 382.7 Ma", gssp: true },
                    { nombre: "Eifeliense", rango: "393.3 - 387.7 Ma", gssp: true }
                  ]
                },
                {
                  epoca: "Devónico Inferior",
                  rango: "419.2 - 393.3 Ma",
                  pisos: [
                    { nombre: "Emsiense", rango: "407.6 - 393.3 Ma", gssp: true },
                    { nombre: "Praguiense", rango: "410.8 - 407.6 Ma", gssp: true },
                    { nombre: "Lochkoviense", rango: "419.2 - 410.8 Ma", gssp: true }
                  ]
                }
              ],
              epocas: ["Devónico Superior", "Devónico Medio", "Devónico Inferior"],
              edadesDestacadas: ["Fameniense", "Frasniense", "Givetiense", "Eifeliense", "Emsiense", "Praguiense", "Lochkoviense"],
              fosiles: "Dunkleosteus (pez placodermo con armadura), Tiktaalik, Rhynia",
              hitos: "'Edad de los Peces'. Primeros bosques en tierra (Archaeopteris) y primeros tetrápodos colonizando el medio terrestre.",
              mnemotecnia: "Devónico = Condado de Devon (Inglaterra)."
            },
            {
              id: "silurian",
              nombre: "Silúrico",
              rango: "443.8 - 419.2 Ma",
              inicioMa: 443.8,
              finMa: 419.2,
              color: "#B3E1B6",
              textColor: "#111111",
              descripcion: "El Silúrico (443.8 - 419.2 Ma) supuso la estabilización climática tras la glaciación ordovícica y el florecimiento de extensos arrecifes marinos. En tierra firme se produjo la primera colonización de plantas vasculares (Cooksonia) y artrópodos terrestres (euriptéridos y milpiés).",
              subdivisiones: [
                {
                  epoca: "Prídoli",
                  rango: "423.0 - 419.2 Ma",
                  pisos: [
                    { nombre: "Prídoli (Piso único oficial)", rango: "423.0 - 419.2 Ma", gssp: true }
                  ]
                },
                {
                  epoca: "Ludlow",
                  rango: "427.4 - 423.0 Ma",
                  pisos: [
                    { nombre: "Ludfordiense", rango: "425.6 - 423.0 Ma", gssp: true },
                    { nombre: "Gorstiense", rango: "427.4 - 425.6 Ma", gssp: true }
                  ]
                },
                {
                  epoca: "Wenlock",
                  rango: "433.4 - 427.4 Ma",
                  pisos: [
                    { nombre: "Homeriense", rango: "430.5 - 427.4 Ma", gssp: true },
                    { nombre: "Sheinwoodiense", rango: "433.4 - 430.5 Ma", gssp: true }
                  ]
                },
                {
                  epoca: "Llandovery",
                  rango: "443.8 - 433.4 Ma",
                  pisos: [
                    { nombre: "Telychiense", rango: "438.5 - 433.4 Ma", gssp: true },
                    { nombre: "Aeroniense", rango: "440.8 - 438.5 Ma", gssp: true },
                    { nombre: "Rhuddaniense", rango: "443.8 - 440.8 Ma", gssp: true }
                  ]
                }
              ],
              epocas: ["Prídoli", "Ludlow", "Wenlock", "Llandovery"],
              edadesDestacadas: ["Ludfordiense", "Gorstiense", "Homeriense", "Sheinwoodiense", "Telychiense", "Aeroniense", "Rhuddaniense"],
              fosiles: "Cooksonia (primera planta vascular), Euriptéridos (escorpiones marinos), Corales tabulados",
              hitos: "Primeras plantas vasculares terrestres que colonizan la tierra firme y primeros artrópodos terrestres (milpiés).",
              mnemotecnia: "Silúrico = Tribu celta de los Siluros en Gales."
            },
            {
              id: "ordovician",
              nombre: "Ordovícico",
              rango: "485.4 - 443.8 Ma",
              inicioMa: 485.4,
              finMa: 443.8,
              color: "#009270",
              textColor: "#ffffff",
              descripcion: "El Ordovícico (485.4 - 443.8 Ma) acogió el Gran Evento de Biodiversificación del Ordovícico (GOBE), triplicando las familias marinas con graptolitos y cefalópodos nautiloideos gigantes (Cameroceras). Culminó con una glaciación y la extinción masiva del Hirnantiense a 443.8 Ma.",
              subdivisiones: [
                {
                  epoca: "Ordovícico Superior",
                  rango: "458.4 - 443.8 Ma",
                  pisos: [
                    { nombre: "Hirnantiense", rango: "445.2 - 443.8 Ma", gssp: true },
                    { nombre: "Katiense", rango: "453.0 - 445.2 Ma" },
                    { nombre: "Sandbiense", rango: "458.4 - 453.0 Ma", gssp: true }
                  ]
                },
                {
                  epoca: "Ordovícico Medio",
                  rango: "470.0 - 458.4 Ma",
                  pisos: [
                    { nombre: "Darriwiliense", rango: "467.3 - 458.4 Ma", gssp: true },
                    { nombre: "Dapingiense", rango: "470.0 - 467.3 Ma", gssp: true }
                  ]
                },
                {
                  epoca: "Ordovícico Inferior",
                  rango: "485.4 - 470.0 Ma",
                  pisos: [
                    { nombre: "Floiense", rango: "477.7 - 470.0 Ma", gssp: true },
                    { nombre: "Tremadociense", rango: "485.4 - 477.7 Ma", gssp: true }
                  ]
                }
              ],
              epocas: ["Ordovícico Superior", "Ordovícico Medio", "Ordovícico Inferior"],
              edadesDestacadas: ["Hirnantiense", "Katiense", "Sandbiense", "Darriwiliense", "Dapingiense", "Floiense", "Tremadociense"],
              fosiles: "Graptolitos planctónicos, Cefalópodos nautiloideos gigantes (Cameroceras), Conodontos",
              hitos: "Gran Evento de Biodiversificación del Ordovícico (GOBE). Termina con una gran glaciación y la primera de las 'Big Five' extinciones masivas (Hirnantiense).",
              mnemotecnia: "Ordovícico = Tribu celta de los Ordovicos en Gales."
            },
            {
              id: "cambrian",
              nombre: "Cámbrico",
              rango: "538.8 - 485.4 Ma",
              inicioMa: 538.8,
              finMa: 485.4,
              color: "#7FA056",
              textColor: "#ffffff",
              descripcion: "El Cámbrico (538.8 - 485.4 Ma) marca el inicio del Fanerozoico. En la 'Explosión Cámbrica' surgieron casi todos los filos animales modernos con exoesqueletos mineralizados (Trilobites como Paradoxides y Olenellus, depredadores como Anomalocaris). Límite basal oficial 538.8 Ma (GSSP de Fortune Head).",
              subdivisiones: [
                {
                  epoca: "Furongiense",
                  rango: "497.0 - 485.4 Ma",
                  pisos: [
                    { nombre: "Piso 10", rango: "~489.5 - 485.4 Ma" },
                    { nombre: "Jiangshaniense", rango: "494.2 - ~489.5 Ma", gssp: true },
                    { nombre: "Paibiense", rango: "497.0 - 494.2 Ma", gssp: true }
                  ]
                },
                {
                  epoca: "Miaolingiense",
                  rango: "509.0 - 497.0 Ma",
                  pisos: [
                    { nombre: "Guzhangiense", rango: "500.5 - 497.0 Ma" },
                    { nombre: "Drumiense", rango: "504.5 - 500.5 Ma" },
                    { nombre: "Wuliuense", rango: "509.0 - 504.5 Ma", gssp: true }
                  ]
                },
                {
                  epoca: "Serie 2",
                  rango: "521.0 - 509.0 Ma",
                  pisos: [
                    { nombre: "Piso 4", rango: "514.0 - 509.0 Ma" },
                    { nombre: "Piso 3", rango: "521.0 - 514.0 Ma" }
                  ]
                },
                {
                  epoca: "Terreneuviense",
                  rango: "538.8 - 521.0 Ma",
                  pisos: [
                    { nombre: "Piso 2", rango: "529.0 - 521.0 Ma" },
                    { nombre: "Fortuniense", rango: "538.8 - 529.0 Ma", gssp: true }
                  ]
                }
              ],
              epocas: ["Furongiense", "Miaolingiense", "Serie 2", "Terreneuviense"],
              edadesDestacadas: ["Piso 10", "Jiangshaniense", "Paibiense", "Guzhangiense", "Drumiense", "Wuliuense", "Piso 4", "Piso 3", "Piso 2", "Fortuniense (538.8 Ma)"],
              fosiles: "Trilobites (Paradoxides, Olenellus), Anomalocaris, Hallucigenia (Esquistos de Burgess)",
              hitos: "'Explosión Cámbrica': Aparición súbita de casi todos los filos animales modernos con exoesqueletos mineralizados. Límite basal oficial 538.8 Ma (GSSP de Fortune Head, Terranova).",
              mnemotecnia: "Cámbrico = Cambria, antiguo nombre en latín de Gales."
            }
          ]
        }
      ]
    },
    {
      id: "proterozoic",
      nombre: "Proterozoico",
      rango: "2500 - 538.8 Ma",
      inicioMa: 2500,
      finMa: 538.8,
      color: "#F73563",
      textColor: "#ffffff",
      descripcion: "'Vida primitiva'. Acumulación masiva de oxígeno atmosférico, aparición de las primeras células eucariotas y organismos pluricelulares.",
      eras: [
        {
          id: "neoproterozoic",
          nombre: "Neoproterozoico",
          rango: "1000 - 538.8 Ma",
          inicioMa: 1000,
          finMa: 538.8,
          color: "#FEB34E",
          textColor: "#222222",
          periodos: [
            { 
              id: "ediacaran", 
              nombre: "Ediacárico", 
              rango: "635 - 538.8 Ma", 
              inicioMa: 635, 
              finMa: 538.8, 
              color: "#FED966", 
              textColor: "#222", 
              descripcion: "El Ediacárico (635 - 538.8 Ma) culmina el Neoproterozoico. Exhibe la emblemática Fauna de Ediacara: los primeros macroorganismos pluricelulares de cuerpo blando (Dickinsonia, Spriggina) tras la deglaciación global.",
              subdivisiones: [
                {
                  epoca: "Neoproterozoico Terminal",
                  rango: "635 - 538.8 Ma",
                  pisos: [
                    { nombre: "Asociación de Ediacara (Fauna macroscópica)", rango: "575 - 538.8 Ma", gssp: true },
                    { nombre: "Fase Post-Marinoana (Calizas de capa)", rango: "635 - 575 Ma", gssp: true }
                  ]
                }
              ],
              hitos: "Fauna de Ediacara: primeros organismos pluricelulares de cuerpo blando (Dickinsonia, Spriggina)." 
            },
            { 
              id: "cryogenian", 
              nombre: "Criogénico", 
              rango: "720 - 635 Ma", 
              inicioMa: 720, 
              finMa: 635, 
              color: "#FED37F", 
              textColor: "#222", 
              descripcion: "El Criogénico (720 - 635 Ma) es el intervalo de la 'Tierra Bola de Nieve' (Snowball Earth), con glaciaciones globales que cubrieron de hielo hasta el ecuador marino.",
              subdivisiones: [
                {
                  epoca: "Glaciaciones Globales",
                  rango: "720 - 635 Ma",
                  pisos: [
                    { nombre: "Glaciación Marinoana", rango: "650 - 635 Ma" },
                    { nombre: "Fase Interglaciar", rango: "660 - 650 Ma" },
                    { nombre: "Glaciación Sturtiana", rango: "717 - 660 Ma", gssp: true }
                  ]
                }
              ],
              hitos: "Episodios de 'Tierra Bola de Nieve' (Snowball Earth, glaciaciones Sturtiana y Marinoana)." 
            },
            { 
              id: "tonian", 
              nombre: "Tónico", 
              rango: "1000 - 720 Ma", 
              inicioMa: 1000, 
              finMa: 720, 
              color: "#FECC96", 
              textColor: "#222", 
              descripcion: "El Tónico (1000 - 720 Ma) presenció la fragmentación del supercontinente Rodinia y la diversificación temprana de acritarcos y algas pluricelulares fotosintéticas.",
              subdivisiones: [
                {
                  epoca: "Neoproterozoico Basal",
                  rango: "1000 - 720 Ma",
                  pisos: [
                    { nombre: "Ruptura de Rodinia", rango: "850 - 720 Ma" },
                    { nombre: "Fase Tónica Temprana", rango: "1000 - 850 Ma" }
                  ]
                }
              ],
              hitos: "Ruptura del supercontinente Rodinia y diversificación temprana de algas pluricelulares." 
            }
          ]
        },
        {
          id: "mesoproterozoic",
          nombre: "Mesoproterozoico",
          rango: "1600 - 1000 Ma",
          inicioMa: 1600,
          finMa: 1000,
          color: "#4CAE4F",
          textColor: "#ffffff",
          periodos: [
            { id: "stenian", nombre: "Esténico", rango: "1200 - 1000 Ma", inicioMa: 1200, finMa: 1000, color: "#6BBF6F", textColor: "#fff", hitos: "Ensamblaje del supercontinente Rodinia, orogenia Grenville." },
            { id: "ectasian", nombre: "Ectásico", rango: "1400 - 1200 Ma", inicioMa: 1400, finMa: 1200, color: "#8DCF91", textColor: "#222", hitos: "Aparición de reproducción sexual documentada en algas rojas (Bangiomorpha)." },
            { id: "calymmian", nombre: "Calímico", rango: "1600 - 1400 Ma", inicioMa: 1600, finMa: 1400, color: "#AEDFB0", textColor: "#222", hitos: "Expansión de plataformas cratónicas sobre la corteza continental." }
          ]
        },
        {
          id: "paleoproterozoic",
          nombre: "Paleoproterozoico",
          rango: "2500 - 1600 Ma",
          inicioMa: 2500,
          finMa: 1600,
          color: "#E05B89",
          textColor: "#ffffff",
          periodos: [
            { id: "statherian", nombre: "Estatérico", rango: "1800 - 1600 Ma", inicioMa: 1800, finMa: 1600, color: "#EA769C", textColor: "#fff", hitos: "Formación del primer supercontinente seguro: Columbia (Nuna)." },
            { id: "orosirian", nombre: "Orosírico", rango: "2050 - 1800 Ma", inicioMa: 2050, finMa: 1800, color: "#EE90AF", textColor: "#222", hitos: "Grandes impactos de meteoritos (Vredefort en Sudáfrica y Sudbury en Canadá)." },
            { id: "rhyacian", nombre: "Riácico", rango: "2300 - 2050 Ma", inicioMa: 2300, finMa: 2050, color: "#F2AAC2", textColor: "#222", hitos: "Glaciación Huroniana prolongada por el colapso del metano atmosférico." },
            { id: "siderian", nombre: "Sidérico", rango: "2500 - 2300 Ma", inicioMa: 2500, finMa: 2300, color: "#F6C5D5", textColor: "#222", hitos: "Gran Evento de Oxidación (GOE): Depósito masivo de formaciones bandeadas de hierro (BIF)." }
          ]
        }
      ]
    },
    {
      id: "archean",
      nombre: "Arcaico",
      rango: "4000 - 2500 Ma",
      inicioMa: 4000,
      finMa: 2500,
      color: "#F0047F",
      textColor: "#ffffff",
      descripcion: "Formación de los primeros continentes (cratones) y surgimiento de las primeras formas de vida unicelular procariota (estromatolitos).",
      eras: [
        { id: "neoarchean", nombre: "Neoarcaico", rango: "2800 - 2500 Ma", inicioMa: 2800, finMa: 2500, color: "#F34399", textColor: "#fff", hitos: "Evolución de la fotosíntesis oxigénica en cianobacterias." },
        { id: "mesoarchean", nombre: "Mesoarcaico", rango: "3200 - 2800 Ma", inicioMa: 3200, finMa: 2800, color: "#F66BAF", textColor: "#fff", hitos: "Crecimiento del supercontinente Vaalbara y expansión de estromatolitos." },
        { id: "paleoarchean", nombre: "Paleoarcaico", rango: "3600 - 3200 Ma", inicioMa: 3600, finMa: 3200, color: "#F894C5", textColor: "#222", hitos: "Microfósiles más antiguos probados (Apex Chert, Australia) y primeros estromatolitos de Pilbara." },
        { id: "eoarchean", nombre: "Eoarcaico", rango: "4000 - 3600 Ma", inicioMa: 4000, finMa: 3600, color: "#FABEDB", textColor: "#222", hitos: "Rocas intactas más antiguas conservadas de la corteza (Gneis de Acasta, cinturón de Isua)." }
      ]
    },
    {
      id: "hadean",
      nombre: "Hádico",
      rango: "~4600 - 4000 Ma",
      inicioMa: 4600,
      finMa: 4000,
      color: "#AE027E",
      textColor: "#ffffff",
      descripcion: "Nacimiento de la Tierra a partir de la nebulosa solar (~4567 Ma), formación de la Luna por colisión de Theia, condensación de los primeros océanos y minerales más antiguos (circones de Jack Hills de 4404 Ma).",
      eras: []
    }
  ]
};

// Lista simplificada y ordenada de los 12 períodos del Fanerozoico (de más antiguo a más reciente)
const PHANEROZOIC_PERIODS = [
  { id: "cambrian", nombre: "Cámbrico", era: "Paleozoico", inicioMa: 538.8, finMa: 485.4, color: "#7FA056", textColor: "#ffffff", clave: "Explosión marina y trilobites" },
  { id: "ordovician", nombre: "Ordovícico", era: "Paleozoico", inicioMa: 485.4, finMa: 443.8, color: "#009270", textColor: "#ffffff", clave: "Diversificación y graptolitos" },
  { id: "silurian", nombre: "Silúrico", era: "Paleozoico", inicioMa: 443.8, finMa: 419.2, color: "#B3E1B6", textColor: "#111111", clave: "Primeras plantas vasculares (Cooksonia)" },
  { id: "devonian", nombre: "Devónico", era: "Paleozoico", inicioMa: 419.2, finMa: 358.9, color: "#CB8C37", textColor: "#ffffff", clave: "Edad de los peces y primeros anfibios" },
  { id: "carboniferous", nombre: "Carbonífero", era: "Paleozoico", inicioMa: 358.9, finMa: 298.9, color: "#67A599", textColor: "#ffffff", clave: "Bosques gigantes, carbón y artrópodos" },
  { id: "permian", nombre: "Pérmico", era: "Paleozoico", inicioMa: 298.9, finMa: 251.9, color: "#F04028", textColor: "#ffffff", clave: "Supercontinente Pangea y gran extinción" },
  { id: "triassic", nombre: "Triásico", era: "Mesozoico", inicioMa: 251.9, finMa: 201.4, color: "#812B92", textColor: "#ffffff", clave: "Primeros dinosaurios y mamíferos" },
  { id: "jurassic", nombre: "Jurásico", era: "Mesozoico", inicioMa: 201.4, finMa: 145.0, color: "#34B2C9", textColor: "#ffffff", clave: "Apogeo dinosaurios, primeras aves (Archaeopteryx)" },
  { id: "cretaceous", nombre: "Cretácico", era: "Mesozoico", inicioMa: 145.0, finMa: 66.0, color: "#7FC64E", textColor: "#111111", clave: "Flores, T-Rex y meteorito K-Pg a 66 Ma" },
  { id: "paleogene", nombre: "Paleógeno", era: "Cenozoico", inicioMa: 66.0, finMa: 23.03, color: "#FD9A52", textColor: "#222222", clave: "Radiación de mamíferos y nummulites" },
  { id: "neogene", nombre: "Neógeno", era: "Cenozoico", inicioMa: 23.03, finMa: 2.58, color: "#FFE619", textColor: "#333333", clave: "Primeros homínidos bípedos y Megalodón" },
  { id: "quaternary", nombre: "Cuaternario", era: "Cenozoico", inicioMa: 2.58, finMa: 0, color: "#F9F97F", textColor: "#333333", clave: "Glaciaciones, mamuts y Homo sapiens" }
];

// Preguntas para el Modo Trivia
const TRIVIA_QUESTIONS = [
  {
    pregunta: "¿Cuál es la fecha oficial (ICS 2023) del inicio del Fanerozoico y Cámbrico?",
    opciones: ["538.8 Ma", "541.0 Ma", "570.0 Ma", "500.0 Ma"],
    correcta: 0,
    explicacion: "En las revisiones oficiales recientes ratificadas en 2023 por la ICS, la base del Piso Fortuniense y del Cámbrico está fijada en 538.8 Ma."
  },
  {
    pregunta: "¿Qué evento y fecha marca el límite entre el Cretácico y el Paleógeno (extinción de los dinosaurios no aviares)?",
    opciones: ["Impacto de Chicxulub a 66.0 Ma", "Erupción de Siberia a 251.9 Ma", "Glaciación Hirnantiense a 443.8 Ma", "Impacto de Vredefort a 2023 Ma"],
    correcta: 0,
    explicacion: "El límite K-Pg está fijado en 66.0 Ma, marcado por la capa de iridio del impacto del asteroide en la península de Yucatán."
  },
  {
    pregunta: "¿Cuál fue la mayor extinción masiva de la historia de la Tierra?",
    opciones: ["Límite Pérmico - Triásico (~251.9 Ma)", "Límite Cretácico - Paleógeno (66.0 Ma)", "Límite Frasniense - Fameniense (Devónico)", "Límite Triásico - Jurásico"],
    correcta: 0,
    explicacion: "La extinción masiva de finales del Pérmico (hace 251.9 Ma) acabó con alrededor del 96% de las especies marinas y más del 70% de vertebrados terrestres."
  },
  {
    pregunta: "¿A qué era geológica pertenecen el Triásico, Jurásico y Cretácico?",
    opciones: ["Mesozoico", "Paleozoico", "Cenozoico", "Neoproterozoico"],
    correcta: 0,
    explicacion: "Pertenecen al Mesozoico (251.9 a 66.0 Ma), conocida clásicamente como la era de los reptiles."
  },
  {
    pregunta: "¿En qué período aparecieron las primeras plantas vasculares terrestres como Cooksonia?",
    opciones: ["Silúrico", "Cámbrico", "Carbonífero", "Jurásico"],
    correcta: 0,
    explicacion: "Fue en el Silúrico (443.8 - 419.2 Ma) cuando las primeras plantas con tejidos conductores colonizaron tierra firme."
  },
  {
    pregunta: "¿Cómo se llama la época geológica más reciente en la que vivimos actualmente dentro del Holoceno?",
    opciones: ["Megalayense", "Norgripiense", "Groenlandiense", "Tarantiense"],
    correcta: 0,
    explicacion: "La ICS subdividió formalmente el Holoceno en tres pisos/edades: Groenlandiense, Norgripiense y el Megalayense (iniciado hace 4200 años hasta hoy)."
  },
  {
    pregunta: "¿Por qué el Carbonífero se llama así?",
    opciones: ["Por los inmensos depósitos de carbón generados por densos bosques de helechos", "Porque la corteza estaba hecha de diamantes", "Por el carbono expulsado por supervolcanes", "Por ser el período más frío de la Tierra"],
    correcta: 0,
    explicacion: "Los troncos de licópsidas arborescentes enterrados en ciénagas formaron las mayores reservas de hulla y carbón del planeta."
  },
  {
    pregunta: "¿Cuál de estos fósiles es el fósil guía más emblemático del Cámbrico?",
    opciones: ["Trilobites", "Ammonites", "Nummulites", "Dientes de Megalodón"],
    correcta: 0,
    explicacion: "Los trilobites tuvieron una rápida radiación evolutiva y fueron los artrópodos marinos dominantes en el Cámbrico."
  },
  {
    pregunta: "¿En qué período floreció la icónica fauna de fósiles de Burgess Shale como Anomalocaris?",
    opciones: ["Cámbrico", "Devónico", "Pérmico", "Ordovícico"],
    correcta: 0,
    explicacion: "El yacimiento canadiense de Burgess Shale es una ventana extraordinaria a la vida marina del Cámbrico medio."
  },
  {
    pregunta: "¿Cuál es el orden cronológico correcto de los tres períodos del Cenozoico (del más antiguo al más reciente)?",
    opciones: ["Paleógeno → Neógeno → Cuaternario", "Cuaternario → Neógeno → Paleógeno", "Neógeno → Paleógeno → Cuaternario", "Cretácico → Terciario → Cuaternario"],
    correcta: 0,
    explicacion: "La escala actual de la ICS divide el Cenozoico en Paleógeno (66 - 23 Ma), Neógeno (23 - 2.58 Ma) y Cuaternario (2.58 Ma - hoy)."
  },
  {
    pregunta: "¿A qué período se le conoce como la 'Edad de los Peces' por la gran diversificación de placodermos y sarcopterigios?",
    opciones: ["Devónico", "Silúrico", "Triásico", "Ordovícico"],
    correcta: 0,
    explicacion: "El Devónico (419.2 - 358.9 Ma) fue testigo de monstruos marinos blindados como Dunkleosteus y de los primeros tetrápodos (Tiktaalik)."
  },
  {
    pregunta: "¿En qué eón ocurrieron la 'Gran Oxidación' y la formación de organismos con células eucariotas?",
    opciones: ["Proterozoico", "Arcaico", "Hádico", "Fanerozoico"],
    correcta: 0,
    explicacion: "Durante el Proterozoico (2500 - 538.8 Ma) el oxígeno se acumuló en atmósfera e hidrosfera, surgiendo los eucariotas y organismos pluricelulares."
  }
];

// Datos para el juego de adivinar el millón de años (Time Guesser)
const TIME_GUESSER_ITEMS = [
  { item: "Límite K-Pg (Extinción de los dinosaurios)", correcto: 66, margen: 15, pista: "Impacto del meteorito de Chicxulub al final del Cretácico." },
  { item: "Límite Pérmico - Triásico (La Gran Mortandad)", correcto: 252, margen: 25, pista: "La mayor extinción en masa al final del Paleozoico." },
  { item: "Base oficial del Cámbrico / Fanerozoico (ICS 2023)", correcto: 539, margen: 30, pista: "Explosión biológica con los primeros animales con esqueleto mineralizado." },
  { item: "Inicio del Cuaternario (Aparición de las glaciaciones y género Homo)", correcto: 2.6, margen: 1.5, pista: "Base del piso Gelasiense." },
  { item: "Límite Jurásico - Cretácico", correcto: 145, margen: 15, pista: "Paso de la era de los grandes saurópodos a la de las primeras plantas con flores." },
  { item: "Límite Silúrico - Devónico", correcto: 419, margen: 25, pista: "Inicio de la gran diversificación de los peces con mandíbulas." },
  { item: "Límite Triásico - Jurásico", correcto: 201, margen: 20, pista: "Extinción que abrió el paso al dominio absoluto de los dinosaurios." },
  { item: "Inicio del Carbonífero", correcto: 359, margen: 25, pista: "Desarrollo de inmensas selvas ecuatoriales y artrópodos gigantes." }
];

// Fósiles y conceptos para el juego de Parejas / Memoria (Memory Match)
const MEMORY_CARDS_DATA = [
  { id: "trilo", nombre: "Trilobites", pareja: "Cámbrico", icon: "🦐", color: "#7FA056" },
  { id: "dunkle", nombre: "Dunkleosteus (Pez blindado)", pareja: "Devónico", icon: "🐟", color: "#CB8C37" },
  { id: "carbon", nombre: "Bosques de helechos gigantes", pareja: "Carbonífero", icon: "🌿", color: "#67A599" },
  { id: "rex", nombre: "T-Rex y Chicxulub (66 Ma)", pareja: "Cretácico", icon: "🦖", color: "#7FC64E" },
  { id: "archae", nombre: "Archaeopteryx (Primera ave)", pareja: "Jurásico", icon: "🪶", color: "#34B2C9" },
  { id: "mammoth", nombre: "Mamut lanudo y Homo", pareja: "Cuaternario", icon: "🦣", color: "#F9F97F" },
  { id: "nummul", nombre: "Nummulites (Foraminíferos)", pareja: "Paleógeno", icon: "🐚", color: "#FD9A52" },
  { id: "ediacara", nombre: "Dickinsonia y fauna blanda", pareja: "Ediacárico", icon: "🪸", color: "#FED966" }
];

// Mnemotécnicas populares para aprender la tabla
const MNEMONICS = [
  {
    titulo: "Los 6 períodos del Paleozoico (De antiguo a reciente)",
    frase: "«Celia Ordena Su Dormitorio Con Pasión»",
    desglose: "<b>C</b>ámbrico → <b>O</b>rdovícico → <b>S</b>ilúrico → <b>D</b>evónico → <b>C</b>arbonífero → <b>P</b>érmico",
    tip: "¡Memorízala una sola vez y jamás volverás a dudar del orden de la Era Paleozoica!"
  },
  {
    titulo: "Los 3 períodos del Mesozoico (De antiguo a reciente)",
    frase: "«Trío de Dinosaurios Jugando al Criquet»",
    desglose: "<b>Tri</b>ásico → <b>Ju</b>rásico → <b>Cr</b>etácico",
    tip: "El Triásico empieza con 3 (Tri), el Jurásico en medio y el Cretácico cierra con el cráter del meteorito."
  },
  {
    titulo: "Los 3 períodos del Cenozoico",
    frase: "«Papá No Come»",
    desglose: "<b>Pa</b>leógeno → <b>Ne</b>ógeno → <b>C</b>uaternario",
    tip: "De lo más antiguo a lo actual."
  },
  {
    titulo: "Épocas del Cenozoico (De antiguo a reciente)",
    frase: "«Paloma Espera Oír Música Para Poder Hablar»",
    desglose: "<b>Pal</b>eoceno → <b>E</b>oceno → <b>O</b>ligoceno → <b>M</b>ioceno → <b>P</b>lioceno → <b>P</b>leistoceno → <b>H</b>oloceno",
    tip: "Las 7 épocas canónicas que todo estudiante de geología y paleontología debe dominar."
  }
];

// ==========================================================================
// RETOS PARA EL JUEGO "EL INTRUSO DEL ESTRATO" (DETECCIÓN DE INFILTRADOS)
// ==========================================================================
const INTRUDER_CHALLENGES = [
  {
    tema: "Era Paleozoica",
    pregunta: "¿Cuál de estos 4 elementos NO pertenece a la Era Paleozoica?",
    opciones: [
      { texto: "Devónico", esIntruso: false },
      { texto: "Silúrico", esIntruso: false },
      { texto: "Jurásico", esIntruso: true },
      { texto: "Cámbrico", esIntruso: false }
    ],
    explicacion: "El Jurásico (201.4 - 145.0 Ma) pertenece al Mesozoico. El Devónico, Silúrico y Cámbrico son períodos del Paleozoico."
  },
  {
    tema: "Era Mesozoica",
    pregunta: "¿Cuál de estos períodos NO es del Mesozoico?",
    opciones: [
      { texto: "Triásico", esIntruso: false },
      { texto: "Pérmico", esIntruso: true },
      { texto: "Jurásico", esIntruso: false },
      { texto: "Cretácico", esIntruso: false }
    ],
    explicacion: "El Pérmico es el último período del Paleozoico (finalizó a 251.9 Ma). El Mesozoico solo tiene 3 períodos: Triásico, Jurásico y Cretácico."
  },
  {
    tema: "Épocas del Cenozoico",
    pregunta: "¿Cuál de estas épocas NO pertenece al Paleógeno?",
    opciones: [
      { texto: "Paleoceno", esIntruso: false },
      { texto: "Eoceno", esIntruso: false },
      { texto: "Mioceno", esIntruso: true },
      { texto: "Oligoceno", esIntruso: false }
    ],
    explicacion: "El Mioceno (23.03 - 5.33 Ma) pertenece al Neógeno. El Paleógeno está compuesto por Paleoceno, Eoceno y Oligoceno."
  },
  {
    tema: "Fósiles Guía del Paleozoico",
    pregunta: "¿Cuál de estos organismos NO vivió en la Era Paleozoica?",
    opciones: [
      { texto: "Trilobites", esIntruso: false },
      { texto: "Graptolitos", esIntruso: false },
      { texto: "Tyrannosaurus rex", esIntruso: true },
      { texto: "Placodermos (peces acorazados)", esIntruso: false }
    ],
    explicacion: "El T-Rex vivió a finales del Cretácico (Mesozoico, ~68-66 Ma), casi 200 millones de años después del fin del Paleozoico."
  },
  {
    tema: "Límites y Extinciones",
    pregunta: "¿Cuál de estos eventos masivos NO ocurrió en el Eón Fanerozoico?",
    opciones: [
      { texto: "Extinción Ordovícico-Silúrico (443 Ma)", esIntruso: false },
      { texto: "Extinción Pérmico-Triásico (251.9 Ma)", esIntruso: false },
      { texto: "Gran Oxidación del Proterozoico (2400 Ma)", esIntruso: true },
      { texto: "Extinción Cretácico-Paleógeno (66 Ma)", esIntruso: false }
    ],
    explicacion: "La 'Gran Oxidación' ocurrió en el Eón Proterozoico (Precámbrico), mientras que las 'Big Five' pertenecen al Fanerozoico."
  },
  {
    tema: "Períodos del Cenozoico Oficial",
    pregunta: "¿Cuál de estos términos NO es un período formal en la tabla ICS 2023?",
    opciones: [
      { texto: "Paleógeno", esIntruso: false },
      { texto: "Terciario", esIntruso: true },
      { texto: "Neógeno", esIntruso: false },
      { texto: "Cuaternario", esIntruso: false }
    ],
    explicacion: "El término 'Terciario' fue abandonado formalmente por la Comisión Internacional de Estratigrafía, dividido en Paleógeno y Neógeno."
  },
  {
    tema: "Hitos Biológicos del Cámbrico",
    pregunta: "¿Cuál de estos hitos NO ocurrió durante el Cámbrico?",
    opciones: [
      { texto: "Aparición de Anomalocaris", esIntruso: false },
      { texto: "Aparición de las plantas con flores", esIntruso: true },
      { texto: "Primeros animales con esqueleto mineral", esIntruso: false },
      { texto: "Radiación explosiva de trilobites", esIntruso: false }
    ],
    explicacion: "Las plantas con flor (angiospermas) no aparecieron hasta el Cretácico temprano (Mesozoico, ~130 Ma), unos 400 millones de años después."
  },
  {
    tema: "Épocas del Cuaternario",
    pregunta: "¿Cuál de estas subdivisiones NO pertenece al Cuaternario?",
    opciones: [
      { texto: "Pleistoceno", esIntruso: false },
      { texto: "Holoceno", esIntruso: false },
      { texto: "Plioceno", esIntruso: true },
      { texto: "Megalayense (Piso actual)", esIntruso: false }
    ],
    explicacion: "El Plioceno (5.33 - 2.58 Ma) pertenece al Neógeno. El Cuaternario comprende exclusivamente el Pleistoceno y el Holoceno."
  },
  {
    tema: "Eón Proterozoico",
    pregunta: "¿Cuál de estos períodos NO pertenece al Neoproterozoico?",
    opciones: [
      { texto: "Ediacárico", esIntruso: false },
      { texto: "Criogénico", esIntruso: false },
      { texto: "Tónico", esIntruso: false },
      { texto: "Devónico", esIntruso: true }
    ],
    explicacion: "El Devónico es del Paleozoico (Fanerozoico). El Neoproterozoico comprende Tónico, Criogénico (Tierra bola de nieve) y Ediacárico."
  },
  {
    tema: "Edad de los Dinosaurios",
    pregunta: "¿Cuál de estos períodos NO albergó dinosaurios no aviares?",
    opciones: [
      { texto: "Triásico", esIntruso: false },
      { texto: "Jurásico", esIntruso: false },
      { texto: "Cretácico", esIntruso: false },
      { texto: "Carbonífero", esIntruso: true }
    ],
    explicacion: "En el Carbonífero dominaban los anfibios gigantes e insectos descomunales; los primeros dinosaurios aparecieron en el Triásico (~230 Ma)."
  }
];

// ==========================================================================
// NIVELES PARA EL CONSTRUCTOR DE LA COLUMNA ESTRATIGRÁFICA (PRINCIPIO DE STENO)
// ==========================================================================
const STRATIGRAPHIC_LEVELS = [
  {
    id: "mesozoic",
    titulo: "1. Columna del Mesozoico (3 estratos)",
    descripcion: "Apila los estratos del Mesozoico desde el más antiguo (base de abajo) al más moderno (cima de arriba):",
    estratos: [
      { id: "triassic", nombre: "Triásico", inicioMa: 251.9, finMa: 201.4, color: "#812B92", textColor: "#fff", ordenSteno: 1, posicion: "Base (Nivel 1)" },
      { id: "jurassic", nombre: "Jurásico", inicioMa: 201.4, finMa: 145.0, color: "#34B2C9", textColor: "#fff", ordenSteno: 2, posicion: "Medio (Nivel 2)" },
      { id: "cretaceous", nombre: "Cretácico", inicioMa: 145.0, finMa: 66.0, color: "#7FC64E", textColor: "#111", ordenSteno: 3, posicion: "Cima (Nivel 3)" }
    ]
  },
  {
    id: "cenozoic",
    titulo: "2. Columna del Cenozoico (3 estratos)",
    descripcion: "Apila los períodos del Cenozoico desde el límite K-Pg hasta la superficie actual:",
    estratos: [
      { id: "paleogene", nombre: "Paleógeno", inicioMa: 66.0, finMa: 23.03, color: "#FD9A52", textColor: "#222", ordenSteno: 1, posicion: "Base (Nivel 1)" },
      { id: "neogene", nombre: "Neógeno", inicioMa: 23.03, finMa: 2.58, color: "#FFE619", textColor: "#333", ordenSteno: 2, posicion: "Medio (Nivel 2)" },
      { id: "quaternary", nombre: "Cuaternario", inicioMa: 2.58, finMa: 0, color: "#F9F97F", textColor: "#333", ordenSteno: 3, posicion: "Cima (Nivel 3)" }
    ]
  },
  {
    id: "paleozoic",
    titulo: "3. Columna del Paleozoico (6 estratos)",
    descripcion: "Apila los 6 períodos del Paleozoico desde la Explosión Cámbrica hasta la extinción Pérmica:",
    estratos: [
      { id: "cambrian", nombre: "Cámbrico", inicioMa: 538.8, finMa: 485.4, color: "#7FA056", textColor: "#fff", ordenSteno: 1, posicion: "Nivel 1 (Base)" },
      { id: "ordovician", nombre: "Ordovícico", inicioMa: 485.4, finMa: 443.8, color: "#009270", textColor: "#fff", ordenSteno: 2, posicion: "Nivel 2" },
      { id: "silurian", nombre: "Silúrico", inicioMa: 443.8, finMa: 419.2, color: "#B3E1B6", textColor: "#111", ordenSteno: 3, posicion: "Nivel 3" },
      { id: "devonian", nombre: "Devónico", inicioMa: 419.2, finMa: 358.9, color: "#CB8C37", textColor: "#fff", ordenSteno: 4, posicion: "Nivel 4" },
      { id: "carboniferous", nombre: "Carbonífero", inicioMa: 358.9, finMa: 298.9, color: "#67A599", textColor: "#fff", ordenSteno: 5, posicion: "Nivel 5" },
      { id: "permian", nombre: "Pérmico", inicioMa: 298.9, finMa: 251.9, color: "#F04028", textColor: "#fff", ordenSteno: 6, posicion: "Nivel 6 (Cima)" }
    ]
  }
];

// ==========================================================================
// FLASHCARDS DE ESTUDIO ACTIVO DE LA TABLA 2023
// ==========================================================================
const FLASHCARDS_DATA = [
  {
    periodo: "Cámbrico",
    era: "Paleozoico",
    color: "#7FA056",
    textColor: "#ffffff",
    rango: "538.8 - 485.4 Ma",
    duracion: "53.4 Ma",
    fosiles: "Trilobites (Olenellus, Paradoxides), Arqueociatos, Anomalocaris",
    hitos: "Explosión biológica del Cámbrico: aparición de casi todos los filos animales con partes duras.",
    mnemotecnia: "Celia (Cámbrico) empieza la historia de la vida con trilobites."
  },
  {
    periodo: "Ordovícico",
    era: "Paleozoico",
    color: "#009270",
    textColor: "#ffffff",
    rango: "485.4 - 443.8 Ma",
    duracion: "41.6 Ma",
    fosiles: "Graptolitos planctónicos, Cefalópodos ortocónicos gigantes, Braquiópodos",
    hitos: "Gran Radiación Ordovícica (GOBE). Primera extinción masiva al final por glaciación en Gondwana.",
    mnemotecnia: "Ordena (Ordovícico) los mares llenos de graptolitos."
  },
  {
    periodo: "Silúrico",
    era: "Paleozoico",
    color: "#B3E1B6",
    textColor: "#111111",
    rango: "443.8 - 419.2 Ma",
    duracion: "24.6 Ma",
    fosiles: "Cooksonia (primera planta vascular), Euriptéridos (escorpiones marinos), Corales tabulados",
    hitos: "Colonización de tierra firme por plantas y artrópodos. Arrecifes de coral extensos.",
    mnemotecnia: "Su (Silúrico) primera planta terrestre asoma verde."
  },
  {
    periodo: "Devónico",
    era: "Paleozoico",
    color: "#CB8C37",
    textColor: "#ffffff",
    rango: "419.2 - 358.9 Ma",
    duracion: "60.3 Ma",
    fosiles: "Dunkleosteus (placodermo acorazado), Tiktaalik (pez-tetrápodo), Primeros ammonoideos",
    hitos: "Edad de los Peces. Primeros bosques terrestres (Archaeopteris) y primeros tetrápodos.",
    mnemotecnia: "Dormitorio (Devónico) con peces blindados y primeros anfibios."
  },
  {
    periodo: "Carbonífero",
    era: "Paleozoico",
    color: "#67A599",
    textColor: "#ffffff",
    rango: "358.9 - 298.9 Ma",
    duracion: "60.0 Ma",
    fosiles: "Lepidodendron y Sigillaria (licopodios arborescentes), Meganeura (libélula gigante), Hylonomus",
    hitos: "Acumulación masiva de carbón. Máximos niveles de O2 (~35%). Aparición del huevo amniota.",
    mnemotecnia: "Con (Carbonífero) inmensos bosques pantanosos de carbón."
  },
  {
    periodo: "Pérmico",
    era: "Paleozoico",
    color: "#F04028",
    textColor: "#ffffff",
    rango: "298.9 - 251.9 Ma",
    duracion: "47.0 Ma",
    fosiles: "Dimetrodon (sinápsido), Glossopteris (flora polar), Fusulinas",
    hitos: "Formación de Pangea completa. La mayor extinción masiva de la Tierra (la Gran Mortandad, 96% especies marinas).",
    mnemotecnia: "Pasión (Pérmico) ardiente por los basaltos de Siberia que cierran el Paleozoico."
  },
  {
    periodo: "Triásico",
    era: "Mesozoico",
    color: "#812B92",
    textColor: "#ffffff",
    rango: "251.9 - 201.4 Ma",
    duracion: "50.5 Ma",
    fosiles: "Coelophysis, Ictiosaurios primitivos, Conodontos (últimos), Cinodontos",
    hitos: "Recuperación de la vida. Primeros dinosaurios, primeros mamíferos y primeros pterosaurios.",
    mnemotecnia: "Trío (Triásico) de pioneros: mamíferos, dinosaurios y reptiles marinos."
  },
  {
    periodo: "Jurásico",
    era: "Mesozoico",
    color: "#34B2C9",
    textColor: "#ffffff",
    rango: "201.4 - 145.0 Ma",
    duracion: "56.4 Ma",
    fosiles: "Archaeopteryx (primera ave), Brachiosaurus, Stegosaurus, Ammonites y Belemnites",
    hitos: "Pangea se fragmenta en Laurasia y Gondwana. Apogeo de los grandes dinosaurios saurópodos.",
    mnemotecnia: "Dinosaurios (Jurásico) dominantes paseando por tierra y mares cálidos."
  },
  {
    periodo: "Cretácico",
    era: "Mesozoico",
    color: "#7FC64E",
    textColor: "#111111",
    rango: "145.0 - 66.0 Ma",
    duracion: "79.0 Ma",
    fosiles: "Tyrannosaurus rex, Triceratops, Rudistas constructores de arrecifes, Cocolitofóridos (tiza)",
    hitos: "Aparición y explosión de las plantas con flores (angiospermas). Impacto de asteroide K-Pg a 66 Ma.",
    mnemotecnia: "Criquet (Cretácico) termina con el meteorito de Chicxulub."
  },
  {
    periodo: "Paleógeno",
    era: "Cenozoico",
    color: "#FD9A52",
    textColor: "#222222",
    rango: "66.0 - 23.03 Ma",
    duracion: "42.97 Ma",
    fosiles: "Nummulites (monedas de piedra), Basilosaurus (ballena primitiva), Hyracotherium",
    hitos: "Gran radiación adaptativa de mamíferos y aves. Máximo Térmico del Paleoceno-Eoceno (PETM).",
    mnemotecnia: "Papá (Paleógeno) ve nacer los órdenes modernos de mamíferos."
  },
  {
    periodo: "Neógeno",
    era: "Cenozoico",
    color: "#FFE619",
    textColor: "#333333",
    rango: "23.03 - 2.58 Ma",
    duracion: "20.45 Ma",
    fosiles: "Australopithecus (primeros homínidos), Megalodón, Mastodontes, Foraminíferos globigerinas",
    hitos: "Expansión de praderas y pastizales (gramíneas). Cierre del istmo de Panamá. Primeros homínidos bípedos.",
    mnemotecnia: "No (Neógeno) te olvides de la marcha bípeda de Australopithecus."
  },
  {
    periodo: "Cuaternario",
    era: "Cenozoico",
    color: "#F9F97F",
    textColor: "#333333",
    rango: "2.58 Ma - Presente",
    duracion: "2.58 Ma",
    fosiles: "Homo sapiens, Mamut lanudo, Smilodon (tigre dientes de sable)",
    hitos: "Ciclos glaciares e interglaciares, evolución del cerebro humano, desarrollo de la agricultura y era actual (Megalayense).",
    mnemotecnia: "Come (Cuaternario) y vive en la era de la humanidad."
  }
];

// ==========================================================================
// FILTRO INTELIGENTE Y DETECCIÓN DE APORTACIONES CONSTRUCTIVAS (IA / HEURÍSTICA)
// ==========================================================================

// Diccionario de términos ofensivos, tóxicos o inapropiados para bloqueo inmediato
const TOXIC_TERMS = [
  "mierda", "puta", "puto", "gilipollas", "cabron", "cabrón", "estupido", "estúpido",
  "idiota", "imbecil", "imbécil", "capullo", "tonto", "retrasado", "subnormal",
  "inutil", "inútil", "asco", "basura", "tarado", "coño", "hostia", "joder",
  "fuck", "shit", "bitch", "asshole", "bastard", "dick", "cunt", "pendejo", "culiao",
  "malparido", "verga", "chinga", "pene", "vagina", "porno", "sex", "spam"
];

// Palabras clave que demuestran aporte y relevancia constructiva geológica o técnica
const GEOLOGICAL_TERMS = [
  "cámbrico", "cambrico", "ordovícico", "ordovicico", "silúrico", "silurico",
  "devónico", "devonico", "carbonífero", "carbonifero", "pérmico", "permico",
  "triásico", "triasico", "jurásico", "jurasico", "cretácico", "cretacico",
  "paleógeno", "paleogeno", "neógeno", "neogeno", "cuaternario", "holoceno",
  "pleistoceno", "plioceno", "mioceno", "oligoceno", "eoceno", "paleoceno",
  "fanerozoico", "proterozoico", "arcaico", "hádico", "hadico", "fósil", "fosil",
  "trilobites", "ammonites", "dinosaurio", "gssp", "clavo dorado", "estrato",
  "era", "período", "periodo", "piso", "edad", "millones", "ma", "ics", "iugs",
  "estratigrafía", "estratigrafia", "geología", "geologia", "extinción", "extincion"
];

const CONSTRUCTIVE_KEYWORDS = [
  "añadir", "agregar", "mejorar", "sugiero", "sugerencia", "idea", "propuesta",
  "podrías", "podrias", "falta", "corregir", "corrección", "correccion", "error",
  "diseño", "interfaz", "móvil", "movil", "pantalla", "sonido", "audio", "juego",
  "trivia", "pregunta", "opción", "tiempo", "slider", "explicación", "explicacion",
  "ejemplo", "estaría bien", "estaria bien", "recomiendo", "propongo", "nivel"
];

/**
 * Analiza un mensaje de feedback enviado por un usuario:
 * 1. Detecta si es ofensivo/tóxico -> RECHAZADO
 * 2. Comprueba longitud y sentido mínimo -> RECHAZADO si es spam/letras aleatorias
 * 3. Evalúa si contiene aportaciones reales y constructivas -> ACEPTADO si suma valor
 */
function analyzeFeedback(rawText, chosenCategory) {
  const text = (rawText || "").trim();
  const lower = text.toLowerCase();

  // 1. Longitud mínima básica
  if (text.length < 12) {
    return {
      isValid: false,
      isOffensive: false,
      score: 10,
      reason: "El mensaje es demasiado corto (mínimo 12 caracteres). Por favor, detalla un poco más tu sugerencia para que nuestro equipo pueda entenderla."
    };
  }

  // 2. Detección de caracteres repetitivos / tecleo aleatorio (gibberish)
  if (/(.)\1{4,}/.test(lower) || /^[asdfghjklqwertyuiopzxcvbnm\s]{15,}$/i.test(lower) && !lower.includes(" ")) {
    return {
      isValid: false,
      isOffensive: false,
      score: 15,
      reason: "El texto parece contener caracteres aleatorios o repetitivos. Por favor, escribe un mensaje claro."
    };
  }

  // 3. Comprobación estricta de lenguaje ofensivo / insultos
  const words = lower.split(/[\s,.;:!?¿¡"()]+/);
  for (const word of words) {
    if (TOXIC_TERMS.some(t => word === t || (word.length > 4 && word.startsWith(t)))) {
      return {
        isValid: false,
        isOffensive: true,
        score: 0,
        reason: "Tu mensaje contiene expresiones o palabras que no cumplen las normas de respeto de la comunidad. Por favor, formula tu sugerencia de manera constructiva y sin insultos."
      };
    }
  }

  // 4. Evaluación de constructividad y relevancia
  let geoHits = 0;
  let constructiveHits = 0;

  GEOLOGICAL_TERMS.forEach(term => {
    if (lower.includes(term)) geoHits++;
  });

  CONSTRUCTIVE_KEYWORDS.forEach(term => {
    if (lower.includes(term)) constructiveHits++;
  });

  // Cálculo de puntuación de relevancia constructiva (0 a 100)
  let score = 50; // Base si no es tóxico
  score += Math.min(30, geoHits * 10);
  score += Math.min(20, constructiveHits * 7);
  if (text.length > 50) score += 5;

  // Si no menciona nada constructivo ni geológico ni técnico y es muy genérico (ej: "hola que tal")
  if (geoHits === 0 && constructiveHits === 0 && text.length < 30) {
    return {
      isValid: false,
      isOffensive: false,
      score: 30,
      reason: "Tu mensaje parece muy general. Para ayudar a nuestro equipo a mejorar la web, cuéntanos qué funcionalidad, juego o estrato geológico te gustaría corregir o expandir."
    };
  }

  // Determinar etiquetas de clasificación para el administrador
  const tags = [];
  if (geoHits > 0) tags.push("Contenido Geológico 🪨");
  if (constructiveHits > 0) tags.push("Mejora de Función / UI ⚡");
  if (score >= 80) tags.push("Alta Relevancia ⭐");

  return {
    isValid: true,
    isOffensive: false,
    score: Math.min(100, score),
    category: chosenCategory || (geoHits > 0 ? "Corrección geológica" : "Mejora general"),
    tags: tags.length > 0 ? tags : ["Sugerencia general"],
    reason: "Aportación válida, respetuosa y constructiva."
  };
}

// Datos de ejemplo iniciales para que el panel de Daniel no esté vacío la primera vez
const INITIAL_FEEDBACK_ITEMS = [
  {
    id: "fb-101",
    user: "Elena Paleontóloga (@elena.geo)",
    email: "elena.paleo@gmail.com",
    provider: "google",
    date: "11/10/2026, 17:30",
    category: "Corrección geológica",
    text: "En la ficha del límite K-Pg a 66.0 Ma, podrías mencionar que en Caravaca de la Cruz (Murcia) y Zumaya (País Vasco) tenemos dos de las secciones estratigráficas de referencia mundial más espectaculares de la capa negra de iridio.",
    score: 95,
    tags: ["Contenido Geológico 🪨", "Alta Relevancia ⭐"],
    status: "nuevo"
  },
  {
    id: "fb-102",
    user: "Marcos V. (@marcos_dev)",
    email: "marcos@alumnos.uni.es",
    provider: "email",
    date: "11/10/2026, 18:15",
    category: "Mejora de interfaz",
    text: "¡La web en iPhone va genial! En el juego de adivinar el millón de años (Time Guesser) estaría increíble añadir vibración háptica suave en el teléfono cuando aciertas clavando la fecha con menos del 5% de error.",
    score: 88,
    tags: ["Mejora de Función / UI ⚡", "Alta Relevancia ⭐"],
    status: "nuevo"
  }
];

