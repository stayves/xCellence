const withBase = (path: string) => {
  const base = import.meta.env.BASE_URL?.replace(/\/+$/, '') ?? '';
  const cleanPath = path.replace(/^\/+/, '');
  return `${base}/${cleanPath}`;
};

export type BlogPost = {
  title: string;
  date: string;
  author: string;
  summary: string;
  readTime: string;
  tag: string;
  coverImage: string;
  coverAlt: string;
  slug?: string;
};

export type ArticleSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  images?: {
    src: string;
    alt: string;
    caption?: string;
  }[];
};

export type FeatureArticle = {
  kicker: string;
  title: string;
  date: string;
  author: string;
  readTime: string;
  slug: string;
  heroImage: string;
  heroAlt: string;
  intro: string;
  sections: ArticleSection[];
  closing: string;
};

export const fusionGuideArticle: FeatureArticle = {
  kicker: 'CAD Playbook',
  title: "A Fisherman's Guide to Fusion 360",
  date: 'December 23, 2025',
  author: 'Zhanibek - CAD Engineer',
  readTime: '7 min read',
  slug: 'fusion-360',
  heroImage: withBase('zhanibek.jpg'),
  heroAlt: 'Zhanibek walking through Fusion 360 workflows with the CAD team',
  intro:
    'Fusion 360 is the quiet superstar of our workshop. In this fisherman-style guide, Zhanibek explains how we lean on Autodesk’s toolkit to model custom FIRST Tech Challenge parts even when off-the-shelf components fall short.',
  sections: [
    {
      title: "What's Fusion 360?",
      paragraphs: [
        'Fusion 360 is the all-in-one environment we trust for robotics: CAD, CAM, rendering, assemblies, and exports in a single window so we never break focus mid-build.',
        'While you can assemble a functioning FTC robot from kit parts alone, modeling and printing your own improves efficiency, trims weight, and offsets the limited supply of REV or goBilda stock in local shops.',
      ],
    },
    {
      title: 'Part 2. Drivetrain & Color track system',
      paragraphs: [
        'Не менее важной частью робота является база. Ее вариаций много и, на самом деле, выбор не обязательно должен быть конкретным. Зачастую, базу собирают под механизмы. В конструировании нет определенных правил, но мы рассмотрим популярные выборы и наши решения.',
        '',
        'Колеса',
        'От колес на приводе зависят движения робота. Также их диаметр и тип мотора используется при написании кода. Мы рекомендуем использовать средние моторы для привода(у нас есть гайд на движения на средних моторах)',
        '',
        'Fig 2.1 Wheel 61.6mm D. x 13.6mm',
        'На нашем роботе 2025 года стояли эти колеса в комбинации',
      ],
      images: [
        {
          src: withBase('7PicNaj.png'),
          alt: 'Fig 2.1 Wheel 61.6mm D. x 13.6mm',
          caption: 'Fig. 2.1 — Wheel 61.6mm D. x 13.6mm',
        },
      ],
    },
    {
      title: 'What do we use it for?',
      paragraphs: [
        "Inside our INTO THE DEEP CAD, every colored component highlights a custom-printed part, and it's nearly every mechanism that manipulates game elements.",
        'The arm, claw, extension, and lift were all tuned digitally before touching printers, which saved plastic, sped up iteration, and let strategy drive geometry.',
      ],
    },
    {
      title: 'Method 1: "TENET" and the Parametric Timeline',
      paragraphs: [
        'The parametric timeline logs every feature you create, and Fusion 360 lets you edit that ledger—almost like rewinding time TENET-style.',
        'Adjust a dimension, replay the timeline, and the downstream features rebuild automatically. It is how we keep experimentation safe instead of brittle.',
      ],
      bullets: [
        'Correct the size of a part when measurements were off.',
        'Fix misaligned joints or constraints without redrawing.',
        'Move sketches that started on the wrong plane.',
        'Extend or shorten extrusions after testing feedback.',
      ],
    },
    {
      title: 'Method 2: Sketch Me Like One of Your French Girls',
      paragraphs: [
        'Everything begins with sketches raised from the base plane, so rookies master lines, arcs, and circles before they ever extrude.',
        'Constraints are the unsung heroes: Equal keeps lines matched, Coincident locks points together, and fully constrained sketches prevent messy geometry when dimensions change.',
      ],
      bullets: [
        'Equal: tie two segments together so scaling one scales the other.',
        'Coincident: snap points (and everything attached) into alignment.',
        'Constraint discipline keeps edits from warping the rest of the sketch.',
      ],
    },
    {
      title: 'Method 3: Astral Projection with Project & Intersect',
      paragraphs: [
        'Project and Intersect duplicate geometry from other sketches or bodies so you can reference it on a new plane—almost like astral projecting shapes into place.',
        'Those projections stay linked to the original, which means timeline edits ripple through every dependent feature and make late-stage tweaks far less painful.',
      ],
    },
    {
      title: 'Fusion 360 Build Gallery',
      paragraphs: [
        'Snapshots from the fisherman guide: sketches, constraints, joints, renders, and assembly checks that keep our FTC parts consistent and lightweight.',
      ],
      images: [
        { src: withBase('1PicZhan.png'), alt: 'Fusion 360 sketch with constraints applied' },
        { src: withBase('2PicZhan.png'), alt: 'Parametric timeline showing editable features' },
        { src: withBase('3PicZhan.png'), alt: 'Extrusion and fillet pass on a drivetrain plate' },
        { src: withBase('4PicZhan.png'), alt: 'Joint preview verifying rotational clearance' },
        { src: withBase('5PicZhan.png'), alt: 'Component breakdown for assembly reuse' },
        { src: withBase('6PicZhan.png'), alt: 'Rendered view of the subsystem housing' },
        { src: withBase('7PicZhan.png'), alt: 'Exploded view highlighting printed parts' },
      ],
    },
  ],
  closing:
    'Zhanibek’s fisherman guide boils down to habits: learn the tools, constrain the sketches, and let Fusion 360 carry the heavy lifting so every print, driver practice, and match day feels lighter.',
};

export const cyrexWroArticle: FeatureArticle = {
  kicker: 'xCellence in Singapore',
  title: 'World Robot Olympiad RoboMission Senior Category. Build, Hardware',
  date: 'December 27, 2025',
  author: 'XLNC Cyrex — Hardware Squad',
  readTime: '8 min read',
  slug: 'wro-cyrex-hardware',
  heroImage: withBase('1PicSayan.jpg'),
  heroAlt: 'XLNC Cyrex manipulator prototype for WRO RoboMission',
  intro:
    'В данном цикле статей и гайдов мы, как республиканские и международные призеры WRO Robomission Senior, хотели бы поделиться своим опытом и фишками в данной категории.',
  sections: [
    {
      title: 'Chapter 1. Game elements manipulators',
      paragraphs: [
        'Две пары клешен манипуляторов сортируют и хранят различные игровые элементы.',
        'Две длинные внешние клешни по бокам предназначены',
        '1) для вращения и удерживание игрового элемента Payload:',
        '',
        '2) для открытия желтой дверцы на поле и выполнения задании с рычагами:',
        '',
        '3) для хватания и перемещение игрового элемента Rocket noses:',
        '',
        'Две внутренние розовые клешни предназначены для сортировки и хранения игровых элементов Bolts:',
        '',
        'Пространство внутри робота - два внутренних кармана для хранение первых двух отсортированных болтов. Они работают на принципе механизма триггер, где при контакте со внешними клешнями, отсеки открываются и переключаются на мод хранения болтов.',
        '',
        'Задняя часть робота включает в себя нововведенную модернизацию робота согласно новому правилу WRO Open Platform. Плата Arduino Nano с связанно блоком EV3 благодаря I2C соединению, который занимает один порт в самом блоке. К этой Arduino плате подключен единственный сервомотор отвечающий за заднюю клешню. Задняя клешня была создана на случай сюрприза или челленджа, которые объявляются во время соревновательных дней.',
        'Робот использовал большое количество 3Д печатных деталей для обеспечения комфортной компоновности робота. Принцип: наименьшее количество использованных деталей на роботе обеспечивает легкую и понятную работу всех частей и деталей робота. На примере фото робота, внутренние клешни, триггерный механизм, удерживающие карманы а также задняя клешня робота были полностью изготовленных из PLA пластика используя выше перечисленный принцип.',
      ],
      images: [
        {
          src: withBase('1PicSayan.jpg'),
          alt: 'Общий вид клешней XLNC Cyrex на RoboMission',
          caption: 'Fig. 1 — Общий вид клешней XLNC Cyrex',
        },
        {
          src: withBase('2PicSayan.png'),
          alt: 'Внешние клешни для Payload и Rocket noses',
          caption: 'Fig. 2 — Внешние клешни для Payload и Rocket noses',
        },
        {
          src: withBase('3PicSayan.png'),
          alt: 'Внутренние карманы и триггерный механизм для Bolts',
          caption: 'Fig. 3 — Внутренние карманы и триггерный механизм для Bolts',
        },
      ],
    },
    {
      title: 'Chapter 2. EV3G blocks and innovative software solutions that were used during the world finals.',
      paragraphs: [
        'Команда XLNC Cyrex Используемые зеленые блоки:',
        'Drive:',
        'Drive Block в среде программирования LEGO EV3 используется для синхронного управления двумя моторами, обычно подключенными к портам B и C, что позволяет роботу двигаться как дифференциальной платформе.',
        'Принцип работы нашего блока основан на следующих параметрах:',
        'Steering (руление) - определяет соотношение скоростей левого и правого моторов.',
        'Значение 0 означает движение прямо (оба мотора вращаются с одинаковой скоростью).',
        'Положительные или отрицательные значения вызывают поворот за счет замедления одного мотора и ускорения другого.',
        'Power/Speed (мощность или скорость) - задает скорость вращения моторов.',
        'Duration (длительность) - определяет, как долго будет выполняться движение (по времени, по оборотам или по градусам).',
        'Таким образом, Drive Block преобразует логические команды программы в точное управление скоростью и направлением вращения двух моторов, обеспечивая прямолинейное движение и плавные повороты робота.',
        '',
        'Line following',
        'Следование по линии с двумя датчиками цвета основано на принципе обратной связи (feedback control). Датчики, установленные слева и справа под роботом, постоянно измеряют отражённый свет или цвет поверхности.',
        'Принцип работы:',
        'Каждый датчик определяет, находится ли он над линией (например, черной) или над фоном (белым).',
        'На основе показаний датчиков программа корректирует скорость моторов:',
        'Если левый датчик видит линию, робот уменьшает скорость левого мотора и увеличивает скорость правого, чтобы скорректировать траекторию.',
        'Если правый датчик видит линию - выполняется противоположная коррекция.',
        'Если оба датчика видят фон, робот продолжает движение прямо.',
        'Использование двух датчиков повышает точность и устойчивость алгоритма по сравнению с одним датчиком, снижая колебания и позволяя роботу быстрее реагировать на изменение траектории линии.',
        '',
        'Turn Angle',
        'Поворот робота на определенный угол в LEGO EV3 реализуется с помощью управления углом вращения мотора, измеряемого встроенным энкодером.',
        'Принцип работы:',
        'Каждый мотор EV3 оснащён энкодером, который отслеживает угол поворота вала в градусах.',
        'Программа задает, на сколько градусов должен повернуться один или оба мотора.',
        'Для поворота на месте обычно:',
        'Один мотор вращается вперёд, а второй - назад, или',
        'Вращается только один мотор, а второй остается неподвижным.',
        'Количество градусов вращения мотора напрямую связано с углом поворота робота и зависит от:',
        'диаметра колёс,',
        'расстояния между колёсами,',
        'типа поворота (на месте или дугой).',
        'Таким образом, Turn Angle обеспечивает точное и воспроизводимое вращение робота за счёт использования энкодеров моторов.',
      ],
      images: [
        {
          src: withBase('4PicSayan.png'),
          alt: 'EV3G блоки: Drive, Line following и Turn Angle',
          caption: 'Fig. 4 — Drive, Line following и Turn Angle в EV3G',
        },
      ],
    },
    {
      title: 'Используемые голубые блоки',
      paragraphs: [
        'Claw Position',
        'Для управления положением клешни робота в LEGO EV3 Mindstorms используется голубой блок управления мотором, работающий в режиме позиционирования по углу вращения.',
        'Принцип работы основан на использовании встроенного энкодера мотора, который позволяет задавать и точно воспроизводить определенные положения клешни.',
        'В программе каждой числовой величине соответствует заранее определённая позиция клешни:',
        'каждое значение задаёт конкретный угол поворота мотора;',
        'угол поворота напрямую определяет положение клешни (открыта, полуоткрыта, закрыта и т.д.).',
        'При выполнении программы мотор автоматически вращается до указанного угла и останавливается, даже если начальное положение клешни отличается от предыдущего. Это обеспечивает:',
        'повторяемость движений;',
        'высокую точность позиционирования;',
        'независимость результата от времени работы мотора.',
        'Такой подход позволяет использовать числовые значения как логические состояния механизма, упрощая алгоритм управления и повышая надежность работы робота при выполнении манипуляционных задач.',
      ],
      images: [
        {
          src: withBase('5PicSayan.png'),
          alt: 'Claw Position — голубой блок для позиционирования манипулятора',
          caption: 'Fig. 5 — Голубой блок Claw Position',
        },
      ],
    },
    {
      title: 'Servo-motor Position и фишки робота',
      paragraphs: [
        'Servo-motor Position',
        'Фишки робота:',
        'Pixy Camera на роботе EV3',
        'Для распознавания цвета игровых элементов на поле в робототехнической системе была использована Pixy Cam, адаптированная для работы с LEGO EV3. Камера обеспечивает обработку изображения в реальном времени и позволяет выделять объекты по цветовым сигнатурам без значительной нагрузки на основной контроллер.',
        'Связь между Pixy Cam и контроллером LEGO EV3 осуществлялась посредством интерфейса I²C (Inter-Integrated Circuit), что обеспечивало стабильную и быструю передачу данных. Использование I²C позволило получать от камеры структурированную информацию, включая идентификатор цветовой сигнатуры и координаты обнаруженного объекта.',
        'Принцип работы системы заключался в следующем:',
        'игровые элементы предварительно обучались в Pixy Cam как отдельные цветовые сигнатуры;',
        'камера анализировала изображение и определяла наличие объекта заданного цвета в поле зрения;',
        'по I²C на EV3 передавались данные о типе цвета и параметрах обнаруженного объекта;',
        'программа робота на основе полученных данных принимала решения о дальнейших действиях (навигация, захват или сортировка элементов).',
      ],
      images: [
        {
          src: withBase('6PicSayan.jpg'),
          alt: 'Servo-модуль задней клешни и её привод',
          caption: 'Fig. 6 — Servo-модуль задней клешни',
        },
        {
          src: withBase('7PicSayan.jpg'),
          alt: 'Pixy Camera на роботе EV3 с креплением под наклоном',
          caption: 'Fig. 7 — Pixy Camera с переходником на EV3',
        },
      ],
    },
  ],
  closing:
    'Применение Pixy Cam с I²C-соединением повысило точность и скорость цветовой идентификации по сравнению с использованием стандартных датчиков цвета, а также позволило эффективно работать в условиях изменяющегося освещения и на больших расстояниях.',
};

export const roboSportArticle: FeatureArticle = {
  kicker: 'World Robot Olympiad RoboSport Category',
  title: 'Build & Hardware by Naj, XLNC Fury',
  date: 'December 28, 2025',
  author: 'XLNC Fury — RoboSport Build Team',
  readTime: '7 min read',
  slug: 'wro-robosport-ball-system',
  heroImage: withBase('robot_sub2.jpg'),
  heroAlt: 'RoboSport flywheel launcher prototype with ball hopper',
  intro:
    'В данном цикле статей и гайдов мы, как республиканские и международные призеры WRO RoboSport, хотели бы поделиться своим опытом и фишками в данной категории.',
  sections: [
    {
      title: 'Part 1. Ball Management System',
      paragraphs: [
        'Сборка и конструкция механизма “выстрела” мячей на парном теннисе очень важны и играю ключевую роль в результатах. Поскольку основным заданием в робоспорте является перекидывание мячей, нужно перекидывать их быстро и на определенную дистанцию, а также удерживать фиолетовые мячи.',
      ],
    },
    {
      title: 'Chapter 1. Shooting Mechanisms',
      paragraphs: [
        'Для первой задачи есть несколько популярных механизмов.',
        'Пинатель',
        '',
        'Fig. 1.1 пример робота-пинатель',
        '',
        'Fig. 1.2 пример робота-пинатель',
        'Конструкция подобных роботов проста - они, ездя по траектории, собирают оранжевые мячи и “пинают” их снизу вверх и вперед. Часто в этом используются резинки или пружины для дополнительного импульса и резкого толчка мячей.',
        'Преимущества подобной системы являются простота конструкции и меньшее количество задействованных деталей. Данный механизм стоит выбирать если нет возможности собрать следующие варианты или не хватает материальных или временных ресурсов. Помимо этого, их программирование легче и быстрее',
        'Недостатки:',
        'нет возможности хранить мячи и, следовательно, траектория ограничена.',
        'Точность “пинка” может быть недостаточна против сильных соперников.',
        'Скорость же зависит от конкретных инженерных решений, но зачастую тоже низка.',
        'https://www.youtube.com/watch?v=vEyGXVtalxY&pp=ygUNd3JvIHJvYm9zcG9ydA%3D%3D',
        'Интересный пример матча с роботами-пинателями',
        '',
        'Fly–Wheel',
        'Flywheel или же летящее колесо тоже является одним из самых популярных решений в робоспорте. Его суть заключается в крутящемся барабане на сжимающемся материале, обычно резинках. Барабан “проглатывает” мячи внутрь робота и “выплевывает” их наружу. За счет натяжения резинок и вращения, мячи вылетают с большой скоростью.',
        '',
        'Fig. 1.3 пример робота с flywheel',
        'В данном механизме также важна задняя стенка, по которой барабан прокатывает мячи, когда хранит их внутри себя. Если на стенке тоже будет натяжение, то результат броска тоже будет лучше: дальше, сильнее, быстрее.',
        '',
        'Fig. 1.4 Задняя стенка для flywheel',
        '',
        'Fig 1.5 Распределение резинок на задней стенке флайуилла',
        '',
        'Резинки играют ключевую роль в работе флайуилла и важно не перестараться с ними. Варианты резинок:',
        'оригинальные лего резинки 5x5',
        'Канцелярские резинки .',
        '',
        'Излишнее натяжение резинки может привести к слишком сильной и дальней стрельбе и, соответственно, вылету мячей за дозволенную зону поля. Поэтому на своем опыте мы советуем растягивать резинки до посветления материала. Не так сильно важна насколько далеко вы стреляете, важно насколько точно и правильно вы это делаете.',
        '',
        'Fig 1.6 Оригинальные резинки lego',
        '',
        'Данный механизм является на наш взгляд наилучшим вариантом. Его используют чемпионы мира и сильнейшие команды. Также при помощи него легче всего организовать остальные функции робота. Тем не менее, запрограммировать его сравнительно сложнее.',
        'Привод барабана стоит на одном большом моторе и повышающей передачи шестернями.',
      ],
      images: [
        {
          src: withBase('1PicNaj.png'),
          alt: 'Fig. 1.1 пример робота-пинатель',
          caption: 'Fig. 1.1 — пример робота-пинатель',
        },
        {
          src: withBase('2PicNaj.png'),
          alt: 'Fig. 1.2 пример робота-пинатель',
          caption: 'Fig. 1.2 — пример робота-пинатель',
        },
        {
          src: withBase('3PicNaj.png'),
          alt: 'Fig. 1.3 пример робота с flywheel',
          caption: 'Fig. 1.3 — пример робота с flywheel',
        },
        {
          src: withBase('4PicNaj.png'),
          alt: 'Fig. 1.4 Задняя стенка для flywheel',
          caption: 'Fig. 1.4 — Задняя стенка для flywheel',
        },
        {
          src: withBase('5PicNaj.png'),
          alt: 'Fig. 1.5 Распределение резинок на задней стенке флайуилла',
          caption: 'Fig. 1.5 — Распределение резинок на задней стенке флайуилла',
        },
        {
          src: withBase('6PicNaj.png'),
          alt: 'Fig. 1.6 Оригинальные резинки LEGO',
          caption: 'Fig. 1.6 — Оригинальные резинки LEGO',
        },
      ],
    },
    {
      title: 'Chapter 2. Ball Holding & Tracking',
      paragraphs: [
        'Ball holding',
        '',
        'Второй миссией тенниса является удержание фиолетового мяча на своей половине поля. То как определять расположение мячей мы разобрали в программной части, тут же рассмотрим аппаратную составляющую.',
        'Фиолетовый мяч мы удерживали в специальной отсеке за стенкой флауилла. Сама стенка приводится в движение средним мотором и поднимается, меняя путь мячей внутри робота. Т.е. вместо того чтобы идти вверх к зоне вылета, фиолетовый мяч прокатывается снизу под стенкой и попадает в отсек между моторами, где он остается до конца игры.',
        'https://youtu.be/EeTfra6aHig',
        'На данном видео пример работы удержания мяча (Примечание: робот на видео удерживает оранжевый мяч, не фиолетовый в целях демонстрации. В настоящей игре нужно удерживать фиолетовый мяч)',
        '',
        'Fig. 2.1 Пример удержания оранжевого мяча внутри робота',
        '',
        'Tracking',
        '',
        'Помимо инициализации цвета через камеры, на роботе установлены датчики цвета для определения наличия мяча внутри робота. Они смотрят вниз внутрь робота, располагаясь над зоной вылета барабана. Мы советуем использовать lego color sensor поскольку у него высокая частота опроса и точность значений цвета не так важна, как наличие данных (этот пункт объясняется в ПО части)',
        '',
        'Fig 2.2 Lego Color Sensor',
      ],
    },
    {
      title: 'Chapter 3. AI Cameras',
      paragraphs: [
        'Поскольку вычислительная способность Lego EV3 блока ограничена и не позволяет запускать на ней компьютерное зрение, используются камеры с встроенным ИИ модулем для всех вычислений и облегченной коммуникации с блоком',
        '',
        'Pixy Camera',
        'https://pixycam.com/pixy-lego/',
        '',
        'Самый популярный и проработанный вариант камеры. Уроки и гайды по ней есть в программной части статьи и в статьях по WRO Future Engineers',
        '',
        'Fig 3.1 Pixy2 for Lego Mindstorms EV3 camera',
        '',
        'Камера имеет два крепления под М2 болты, что не удобно для ее установки на лего балки. Поэтому ниже прикреплен файл для 3D печати переходника с учетом угла наклона камеры.',
        '[тут будет файл на сайте]',
        'Заполнение печати рекомендовано на 15-30%, тип пластика не важен.',
        '',
        'Купить PixyCam можно на OLX или в чате KZRobotics, а также на Ebay и Aliexpress',
      ],
    },
    {
      title: 'Part 4. Useful materials',
      paragraphs: [
        'Здесь представленны полезные материалы по данной категории',
        '',
        'Лекция на учебно-тренировочных сборах WRO 2025 по категории RoboSport',
        'https://www.youtube.com/watch?v=FoRNLSMaYOM&t=8s',
      ],
    },
  ],
  closing: 'Купить PixyCam можно на OLX или в чате KZRobotics, а также на Ebay и Aliexpress.',
};

export const blogPosts: BlogPost[] = [
  {
    title: 'World Robot Olympiad RoboSport Category',
    date: 'December 28, 2025',
    author: 'XLNC Fury — RoboSport Build Team',
    summary:
      'Part 1 Ball Management System: Пинатель, flywheel, удержание фиолетового мяча и Pixy Camera — весь текст прямо из гайда Naj.',
    readTime: '7 min read',
    tag: 'Hardware',
    coverImage: withBase('1PicNaj.png'),
    coverAlt: 'RoboSport flywheel launcher prototype on field',
    slug: 'wro-robosport-ball-system',
  },
  {
    title: 'xCellence in Singapore',
    date: 'December 27, 2025',
    author: 'XLNC Cyrex — Hardware Squad',
    summary:
      'Клешни, Open Platform на Arduino Nano и все EV3G блоки для RoboMission — публикуем оригинальный текст нашего сингапурского гайда.',
    readTime: '8 min read',
    tag: 'Hardware',
    coverImage: withBase('1PicSayan.jpg'),
    coverAlt: 'XLNC Cyrex manipulator prototype for WRO RoboMission',
    slug: 'wro-cyrex-hardware',
  },
  {
    title: "A Fisherman's Guide to Fusion 360",
    date: 'December 23, 2025',
    author: 'Zhanibek - CAD Engineer',
    summary:
      'Zhanibek shares the Fusion 360 habits that let us design lighter custom FTC parts even when kit inventories run thin.',
    readTime: '7 min read',
    tag: 'CAD',
    coverImage: withBase('1PicZhan.png'),
    coverAlt: 'Zhanibek presenting Fusion 360 CAD workflow',
    slug: 'fusion-360',
  },
  
];

export const blogArticlesBySlug: Record<string, FeatureArticle> = {
  [fusionGuideArticle.slug]: fusionGuideArticle,
  [cyrexWroArticle.slug]: cyrexWroArticle,
  [roboSportArticle.slug]: roboSportArticle,
};

