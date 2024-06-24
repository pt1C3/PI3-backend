const { Op } = require('sequelize'); //O Op serve para criar queries mais complexas usando o sequelize
var sequelize = require('../models/database');
const initModels = require('../models/init-models');
const { product, category, price } = initModels(sequelize);

const controller = {}
sequelize.sync(); //Sincroniza com a DB

//Listagem dos filmes
controller.produtos_min_list = async (req, res) => {
    await product.findAll({
        attributes: [
            'name',
            'icon',
            'description'
        ],
        include: [
            {
                model: category,
                as: 'category',
                attributes: ['designation']
            },
            {
                model: price,
                as: 'prices',
                attributes: ['price', 'discount_percentage'],
                where: {
                    price: {
                        [Op.eq]: sequelize.literal(`(
                            SELECT MIN(subPrice.price)
                            FROM price AS subPrice
                            WHERE subPrice.productid = prices.productid
                        )`)
                    }
                },
                required: true
            }
        ]
    }).then(data => {
        res.json(data);
    });



    
}
controller.produtos_add = async (req, res) => {
    product.create({ //Criamos o item com a informação do request
        name: req.body.name,
        description: req.body.description,
        status: req.body.status,
        //icon: req.file.filename, //O ficheiro é recebido através do multer no filmesRouter.js
        features: req.body.features,
        categoryid: req.body.categoryid
    }).then(item => {
        res.json(item); //Finalmente devolvemos o item criado
    })
}
controller.apenasum = async (req,res) => {
    await sequelize.query(`

        INSERT INTO PRODUCT_STATUS (DESIGNATION) VALUES ('Hidden'), ('Visible'), ('Removed');
        INSERT INTO VERSION_STATUS (DESIGNATION) VALUES ('Beta'), ('Stable'), ('Hidden'), ('Removed');
        INSERT INTO LICENSE_STATUS (DESIGNATION) VALUES ('Specified'), ('Unspecified');
        INSERT INTO PLAN_STATUS (DESIGNATION) VALUES ('Inactive'), ('Active');
        INSERT INTO PAYMENT_STATUS (DESIGNATION) VALUES ('Pending'), ('Payed'), ('Cancelled');
        INSERT INTO USER_STATUS (DESIGNATION) VALUES ('Inactive'), ('Active');
        INSERT INTO NOTIFICATION_STATUS (DESIGNATION) VALUES ('Unread'), ('Read');
        INSERT INTO TICKET_STATUS (DESIGNATION) VALUES ('Pending'), ('Replied');
        INSERT INTO USER_TYPE (DESIGNATION) VALUES ('Unassigned'), ('Manager'), ('Owner'), ('Admin');
        
        -- Category
        INSERT INTO CATEGORY (DESIGNATION) VALUES ('Design'), ('Productivity'), ('Communication'), ('Development'), ('Entertainment');
        
        -- Requirements
        INSERT INTO REQUIREMENTS (OS, PROCESSOR, RAM, HARD_DISK_SPACE, GRAPHIC_CARD, INTERNET_CONECTION) VALUES 
        ('Windows 10 64-bit', 'Multicore Intel or AMD processor', '8GB RAM', '15GB available hard disk space', '1GB of video memory and support for DirectX 12', 'Internet connection required to activate the software'),
        ('Cross-platform (Windows, macOS, Linux)', 'Dual-core processor or higher', '4GB RAM', '200MB available hard disk space', 'Integrated graphics card or better', 'Internet connection recommended for synchronization and updates'),
        ('Windows 10 64-bit, macOS, Linux', 'Quad-core Intel or AMD processor', '16GB RAM', '20GB available hard disk space (SSD recommended)', 'Dedicated graphics card with 4GB of video memory', 'Internet connection for initial activation and collaboration features'),
        ('Cross-platform (Windows, macOS, Android, iOS)', 'Dual-core processor or higher', '2GB RAM', '100MB available hard disk space', 'Integrated graphics or better', 'Internet connection for streaming and content updates'),
        ('Windows 10 64-bit, macOS, Linux, Android, iOS', 'Dual-core processor or higher', '4GB RAM', '500MB available hard disk space', 'Integrated graphics card', 'Internet connection for messaging, calls, and synchronization'),
        ('Windows 10 64-bit', 'Multicore Intel or AMD processor', '8GB RAM', '20GB available hard disk space', '1GB of video memory and support for DirectX 12', 'Internet connection required to activate the software');
        
        -- Users
        INSERT INTO "USER" (USTATUSID, UTYPEID, FIRSTNAME, LASTNAME, EMAIL, PASSWORD, COUNTRY, PHONE_NUMBER, IMAGE, CREATION_DATE) VALUES 
        (2, 1, 'Ana', 'Silva', 'ana.silva@gmail.com', 'Password123!', 'Portugal', '+351 912345678', 'https://pi3-backend.onrender.com/images/users/1.png', NOW()),
        (2, 1, 'João', 'Pereira', 'joao.pereira@gmail.com', 'SecurePass!234', 'Portugal', '+351 913456789', 'https://pi3-backend.onrender.com/images/users/2.png', NOW()),
        (2, 1, 'Carlos', 'Martinez', 'carlos.martinez@Gmail.com', 'MartinezPass456', 'Mexico', '555-8765', 'https://pi3-backend.onrender.com/images/users/3.png', NOW()),
        (2, 1, 'Evan', 'Lee', 'evan.lee@gmail.com', 'LeePass!890', 'South Korea', '555-2345', 'https://pi3-backend.onrender.com/images/users/4.png', NOW()),
        (2, 1, 'Sophia', 'Chang', 'sophia.chang@example.com', 'ChangPass123!', 'United States', '555-6789', 'https://pi3-backend.onrender.com/images/users/5.png', NOW()),
        (2, 1, 'Michael', 'Nguyen', 'michael.nguyen@example.com', 'NguyenPass456!', 'Canada', '555-1234', 'https://pi3-backend.onrender.com/images/users/6.png', NOW()),
        (2, 4, 'Rafael', 'Silva', 'rafael.silva@gmail.com', 'Rafael!123', 'Portugal', '+351 912345678', 'https://pi3-backend.onrender.com/images/users/7.png', NOW());
        
        -- Products
        INSERT INTO PRODUCT (CATEGORYID, NAME, DESCRIPTION, STATUSID, ICON, FEATURES) VALUES 
        (1, 'Creativortex', 'Dive into a whirlwind of innovative possibilities as you craft stunning visuals with ease. Whether you''re designing graphics, logos, or layouts, CreatiVortex provides intuitive tools and a dynamic workspace to bring your ideas to life. Say hello to endless inpiration with CreatiVortex by your side.', 2, 'https://pi3-backend.onrender.com/images/products/icon/1.png', 'Unlock the full spectrum of your creativity with CreatiVortex – the ultimate toolkit for graphic design aficionados and visual storytellers alike. Step into a realm where imagination knows no bounds and unleash your artistic prowess with confidence. CreatiVortex offers a rich tapestry of features tailored to elevate your design journey to new heights.[p]At the heart of CreatiVortex lies a robust suite of intuitive tools meticulously crafted to empower you in every aspect of your creative process. From crafting eye-catching graphics and captivating logos to sculpting intricate layouts with precision, CreatiVortex is your trusted companion for bringing your boldest ideas to life.[p]Embrace a seamless workflow with our dynamic workspace, meticulously designed to adapt to your unique needs and preferences. Dive deep into a whirlwind of innovative possibilities as you explore a vast array of design elements, effortlessly blending colors, shapes, and textures to create visually stunning masterpieces.[p]Experience the freedom to express yourself like never before with CreatiVortex''s versatile array of features. From advanced layering and masking capabilities to seamless integration with popular design formats, CreatiVortex empowers you to unleash your creativity with unparalleled flexibility and control.[p]But that''s not all – CreatiVortex is more than just a design tool; it''s a wellspring of inspiration waiting to be tapped. Immerse yourself in a world of endless creativity, where every stroke of your digital brush is infused with boundless potential.[p]Join the ranks of visionary creators and design aficionados who have made CreatiVortex their go-to platform for turning dreams into reality. Say hello to a new era of design innovation and let CreatiVortex be your guiding light on your creative journey. With CreatiVortex by your side, the possibilities are truly limitless.'),
        (2, 'TaskMaster', 'Maximize your efficiency with TaskMaster, the task management app that simplifies your organization and boosts your daily productivity.', 2, 'https://pi3-backend.onrender.com/images/products/icon/2.png', 'TaskMaster offers a clean and intuitive user interface that makes navigating and managing your tasks a breeze. With customizable task lists and reminders, you can tailor the app to fit your unique needs and preferences. The app integrates seamlessly with popular calendars, ensuring that all your important dates and deadlines are in one place. Track your progress and generate performance reports to stay on top of your goals and achievements. TaskMaster syncs across multiple devices, so you can access your tasks and reminders wherever you are. Real-time notifications and alerts keep you informed and on track, making sure you never miss an important task or deadline. Additionally, TaskMaster features advanced collaboration tools that allow you to share tasks and projects with team members, making it perfect for both personal and professional use. The app supports voice commands and speech recognition, enabling hands-free task management. It also includes a priority-setting function that helps you focus on the most critical tasks first. With secure cloud storage, all your data is safely backed up and accessible anytime.[p]TaskMaster offers a dark mode option to reduce eye strain and conserve battery life on your devices. For added convenience, the app provides customizable widgets that you can place on your home screen for quick access to your most important tasks. Lastly, TaskMaster includes a robust search function, allowing you to find tasks and notes quickly and efficiently. This version includes collaboration tools, voice commands, priority-setting, secure cloud storage, dark mode, customizable widgets, and a robust search function.'),
        (4, 'CodeFlow', 'CodeFlow provides an advanced code editor with syntax highlighting, making it easier to read and write code efficiently. With built-in version control, you can track changes and collaborate seamlessly with your team.', 2, 'https://pi3-backend.onrender.com/images/products/icon/3.png', 'CodeFlow provides an advanced code editor with syntax highlighting, making it easier to read and write code efficiently. With built-in version control, you can track changes and collaborate seamlessly with your team. The interactive debugger helps you identify and fix issues quickly, ensuring a smooth development experience. [p]CodeFlow supports multiple programming languages, allowing you to work on diverse projects without switching tools. The environment includes automation tools for building and deploying your applications, streamlining your workflow. You can customize CodeFlow with a wide range of extensions and plugins to suit your specific needs. CodeFlow also offers real-time collaboration features, enabling team members to work together on code in real-time. The platform integrates with popular development tools and services, providing a cohesive and efficient development ecosystem. With its responsive and customizable user interface, CodeFlow adapts to your workflow, enhancing productivity. Secure cloud storage ensures that your projects are safely backed up and accessible from anywhere. [p]CodeFlow includes a powerful search function, allowing you to quickly find code snippets, files, and documentation. To further enhance your development experience, CodeFlow features dark mode to reduce eye strain during long coding sessions. It also supports voice commands, enabling hands-free coding for greater convenience. The priority-setting function helps you focus on critical tasks, ensuring that you meet your development milestones. CodeFlow''s customizable widgets provide quick access to your most important tools and resources, and its robust search functionality makes finding and managing your code effortless. This version includes real-time collaboration, version control, interactive debugging, multiple language support, automation tools, cloud storage, dark mode, voice commands, priority-setting, and customizable widgets.'),
        (5, 'FunStream', 'Enjoy limitless entertainment with FunStream, the streaming platform that offers a vast library of movies, series, and music to suit all tastes. Whether you''re in the mood for the latest blockbuster, a classic film, or a binge-worthy series, FunStream has it all. Plus, with a diverse range of music from various genres, you''ll always find something to suit your mood. FunStream''s intuitive interface and personalized recommendations make it easy to discover new favorites and enjoy your go-to content seamlessly.', 2, 'https://pi3-backend.onrender.com/images/products/icon/4.png', 'FunStream provides an extensive catalog of movies and series, ensuring there''s always something new to watch. The platform offers customizable playlists, allowing you to create and manage your own music and video collections. FunStream''s recommendation engine tailors suggestions based on your viewing and listening preferences, making it easier to discover new content.[p]With support for multiple devices, you can stream your favorite shows and songs wherever you are. The platform delivers high-quality streaming in HD and 4K, providing an immersive viewing experience. For added convenience, FunStream includes an option to download content for offline viewing, ensuring you can enjoy your media even without an internet connection. The user-friendly interface makes it easy to navigate through the vast library, and real-time notifications keep you updated on new releases and recommendations.[p]FunStream''s advanced search function helps you quickly find specific titles, genres, or artists. The platform also features secure cloud storage, ensuring that your playlists and preferences are safely backed up and accessible anytime. FunStream supports parental controls, allowing you to manage what content is accessible to different users in your household. It also includes a dark mode option to reduce eye strain during late-night viewing sessions.[p]Customizable widgets provide quick access to your favorite content directly from your home screen. FunStream integrates with popular social media platforms, enabling you to share your favorite movies, series, and music with friends. This version includes offline downloads, high-quality streaming, personalized recommendations, advanced search, secure cloud storage, parental controls, dark mode, customizable widgets, and social media integration.'),
        (3, 'ChatSphere', 'Stay connected effortlessly with ChatSphere, the ultimate communication platform designed to enhance collaboration and streamline your interactions. With features like text messaging, voice calls, and video conferencing all in one place, ChatSphere makes it easy to share files, photos, and videos instantly.', 2, 'https://pi3-backend.onrender.com/images/products/icon/5.png', 'ChatSphere offers a seamless messaging experience with instant notifications, ensuring you never miss an important message. The platform supports high-quality voice and video calls, allowing for clear and effective communication. With group chat functionality, you can easily collaborate with multiple team members or friends at once. The platform includes a file-sharing feature, making it simple to exchange documents, images, and other media. ChatSphere integrates with various productivity tools, enabling you to manage your tasks and schedules without leaving the app. The secure encryption ensures that all your conversations and data are protected.[p]ChatSphere''s intuitive interface makes it easy to navigate and use, whether you''re tech-savvy or new to digital communication tools. Real-time translation features break down language barriers, allowing you to communicate with people from different linguistic backgrounds effortlessly. The app also offers customizable notifications, so you can prioritize the alerts that matter most to you. With ChatSphere''s robust search function, you can quickly find past conversations, files, and contacts. [p]The platform supports multiple devices, ensuring that you can stay connected whether you''re on your phone, tablet, or computer. Additionally, ChatSphere provides customizable chat themes and backgrounds, allowing you to personalize your communication experience. For professional use, ChatSphere includes advanced meeting scheduling and management tools, making it ideal for business environments. The app also supports integration with popular calendar applications, ensuring all your appointments and meetings are synchronized. This version includes real-time translation, secure encryption, file sharing, group chat, customizable notifications, multiple device support, chat themes, meeting scheduling, and calendar integration.'),
        (1, 'DesignSphere', 'Unleash your creativity with DesignSphere, the ultimate platform for graphic design and visual communication. Whether you''re crafting stunning visuals, designing logos, or creating intricate layouts, DesignSphere empowers you to bring your ideas to life with ease and precision.', 2, 'https://pi3-backend.onrender.com/images/products/icon/6.png', 'DesignSphere offers a comprehensive suite of tools tailored for graphic designers and visual storytellers. Dive into a seamless design experience with intuitive features that enhance your creative workflow.[p]Craft eye-catching graphics and logos effortlessly using DesignSphere''s robust tools and dynamic workspace. Explore a rich palette of colors, shapes, and textures to create visually stunning masterpieces that captivate your audience.[p]Enhance collaboration with seamless file-sharing and integration with popular design formats. DesignSphere''s secure cloud storage ensures your projects are safely backed up and accessible from anywhere, allowing you to work on multiple devices without missing a beat.[p]Customize your design environment with personalized themes and layouts that suit your creative style. From beginners to seasoned professionals, DesignSphere adapts to your needs with intuitive navigation and real-time collaboration features.[p]Stay organized with advanced project management tools and integration with popular productivity apps. DesignSphere supports seamless scheduling and synchronization with calendar applications, ensuring you never miss a deadline.[p]Whether you''re designing for print or digital media, DesignSphere empowers you to unleash your creativity and elevate your design process to new heights.');
        
        -- Images
        INSERT INTO IMAGES (URL, PRODUCTID) VALUES 
        ('(endereço web para a imagem)', 1),
        ('(endereço web para a imagem)', 1),
        ('(endereço web para a imagem)', 1),
        ('(endereço web para a imagem)', 1),
        ('(endereço web para a imagem)', 2);
        
        -- Business
        INSERT INTO BUSINESS (USERID, NAME, WEBSITE) VALUES 
        (1, 'PixelPerfect Design Studio', 'www.pixelperfectdesignstudio.com'),
        (2, 'TaskForce Solutions', 'www.taskforcesolutions.com'),
        (3, 'CodeCraft Labs', 'www.codecraftlabs.com'),
        (4, 'StreamWave Entertainment', 'www.streamwaveentertainment.com'),
        (5, 'ConnectSphere Communications', 'www.connectspherecommunications.com');
        
        -- Addons
        INSERT INTO ADDON (PRODUCTID, NAME, STATUS, DESCRIPTION) VALUES 
        -- Addons (continued)
        (1, 'Premium Design Templates', 2, 'Access a library of professionally designed templates tailored for various creative projects, ensuring high-quality outputs with minimal effort.'),
        (1, 'Enhanced Collaboration Tools', 2, 'Facilitate seamless collaboration among team members and clients with features like real-time editing, feedback management, and version control within Creativortex.'),
        (2, 'Time Tracking and Analytics', 2, 'Track task completion times, analyze productivity trends, and generate detailed reports to optimize workflow and achieve project goals efficiently.'),
        (4, 'Voice Command Integration', 2, 'Execute coding commands, navigate through code, and perform tasks hands-free using voice commands, enhancing productivity and workflow efficiency.'),
        (5, 'High-Quality Streaming', 2, 'Upgrade to 4K streaming capabilities on FunStream, delivering immersive viewing experiences with crystal-clear video quality.');
        
        -- FAQs
        INSERT INTO FAQ (PRODUCTID, QUESTION, ANSWER) VALUES 
        (1, 'What types of design projects can I create with Creativortex?', 'Creativortex supports a wide range of design projects including graphics, logos, layouts, and more. Its intuitive tools and dynamic workspace are tailored to empower your creativity across various visual mediums.'),
        (1, 'Can I collaborate with others using Creativortex?', 'Yes, Creativortex offers enhanced collaboration tools such as real-time editing, feedback management, and version control, facilitating seamless teamwork on creative projects.'),
        (1, 'Is Creativortex suitable for beginners in graphic design?', 'Absolutely! Creativortex provides a user-friendly interface and intuitive features designed to support users at all skill levels, from beginners to experienced designers.'),
        (2, 'How does TaskMaster help improve productivity?', 'TaskMaster enhances productivity by offering customizable task lists, reminders, and integration with popular calendars. Its time tracking and analytics features also provide insights for optimizing workflow efficiency.'),
        (4, 'Which programming languages are supported by CodeFlow?', 'CodeFlow supports multiple programming languages, making it versatile for developers working on various projects. Some supported languages include Java, Python, JavaScript, and more.'),
        (5, 'Can I download content for offline viewing with FunStream?', 'Yes, FunStream allows users to download content such as movies and series for offline viewing, ensuring entertainment is accessible even without an internet connection.');
        
        -- Prices
        INSERT INTO PRICE (PRODUCTID, PRICE, DISCOUNT_PERCENTAGE, CHANGE_DATE, NUMBER_OF_LICENSES) VALUES 
        (1, 59.99, NULL, '2024-06-22', 100),
        (1, 109.99, 5, '2024-06-22', 200),
        (2, 39.99, NULL, '2024-06-22', 50),
        (2, 69.99, NULL, '2024-06-22', 100),
        (3, 49.99, 5, '2024-06-22', 50),
        (3, 89.99, NULL, '2024-06-22', 100),
        (4, 89.99, NULL, '2024-06-22', 50),
        (4, 159.99, 10, '2024-06-22', 100),
        (5, 19.99, NULL, '2024-06-22', 50),
        (5, 34.99, NULL, '2024-06-22', 100);
        
        -- Plans
        INSERT INTO PLAN (PRICEID, PLANSTATUSID, BUSINESSID, SALE_DATE) VALUES 
        (1, 2, 1, '2024-06-22'),
        (3, 2, 2, '2024-06-22'),
        (7, 2, 3, '2024-06-22'),
        (9, 2, 4, '2024-06-22'),
        (5, 2, 5, '2024-06-22');
        
        -- Payments
        INSERT INTO PAYMENT (PLANID, PSTATUSID, PAYMENT_DATE, DUE_DATE) VALUES 
        (1, 2, '2024-06-22 12:00:00', '2024-07-22 00:00:00'),
        (2, 1, NULL, '2024-07-01 00:00:00'),
        (3, 2, '2024-06-22 14:30:00', '2024-07-22 00:00:00'),
        (4, 1, NULL, '2024-07-15 00:00:00'),
        (5, 2, '2024-06-22 10:00:00', '2024-07-22 00:00:00');
        
        -- Licenses
        INSERT INTO LICENSE (PLANID, USERID, LSTATUSID, KEY) VALUES 
        (1, 1, 2, 'ABCD-EFGH-1234'),
        (2, 2, 1, 'WXYZ-9876-UVTR'),
        (3, 3, 2, 'KLMN-4567-PQRS'),
        (4, 4, 1, '1234-5678-ABCD'),
        (5, 5, 2, 'EFGH-7890-IJKL');
        
        -- Notifications
        INSERT INTO NOTIFICATION (NSTATUSID, USERID, TITLE, DESCRIPTION, DATE, LINK) VALUES 
        (1, 6, 'Welcome to PixelPerfect Design Studio!', 'You have been added to PixelPerfect Design Studio.', '2024-06-22 09:00:00', '(endereço web)'),
        (1, 2, 'TaskMaster Upgrade Available', 'Discover new features in TaskMaster. Upgrade now for enhanced productivity!', '2024-06-22 10:00:00', '(endereço web)'),
        (1, 3, 'CodeFlow Tips and Tricks', 'Learn advanced coding techniques with CodeFlow. Explore our latest resources!', '2024-06-22 11:00:00', '(endereço web)'),
        (1, 4, 'FunStream Summer Movie Marathon', 'Join us for a summer movie marathon on FunStream. Check out our latest releases!', '2024-06-22 12:00:00', '(endereço web)'),
        (1, 5, 'ChatSphere Update', 'ChatSphere now supports new languages. Stay connected with ease!', '2024-06-22 13:00:00', '(endereço web)');
        
        -- Packages
        INSERT INTO PACKAGE (NAME, DESCRIPTION, STATUS, ICON, FEATURE) VALUES 
        ('Creative Design Master Bundle', 'Unlock unlimited creative potential with the Creative Design Master Bundle, featuring CreatiVortex and DesignSphere. Whether you are a graphic design enthusiast or a seasoned professional, this bundle provides the ultimate toolkit to transform your ideas into captivating visual masterpieces.', 2, 'https://pi3-backend.onrender.com/images/packages/1.png', 'The Creative Design Master Bundle combines two powerhouse applications: CreatiVortex and DesignSphere, tailored for graphic designers and visual storytellers alike.[p]CreatiVortex offers an intuitive workspace equipped with advanced tools for crafting graphics, logos, and layouts. Dive into a whirlwind of creativity with dynamic features that empower you to explore a vast array of design elements and unleash your artistic prowess.[p]DesignSphere complements your creative journey with a comprehensive suite of tools designed to elevate your graphic design experience. From creating eye-catching visuals to seamless integration with popular design formats, DesignSphere ensures a seamless workflow across multiple devices, backed by secure cloud storage for peace of mind.[p]Whether you''re designing for print or digital media, the Creative Design Master Bundle equips you with everything you need to push the boundaries of creativity and achieve professional excellence in every project.');
        
        -- Package Products
        INSERT INTO PRODUTOS_DO_PACOTE (PACKAGEID, PRODUCTID) VALUES 
        (1, 1),
        (1, 6);
        
        -- Support Tickets
        INSERT INTO SUPPORT_TICKET (USERID, TSTATUSID, REASON, DETAILS, DATE) VALUES 
        (1, 1, 'Software Installation', 'Unable to install CreatiVortex on Windows 10. Keeps showing an error code 0x80070005.', '2024-06-23 14:30:00'),
        (2, 1, 'Account Issues', 'Can''t log in to TaskMaster app after recent update. Password reset link not working.', '2024-06-22 09:15:00'),
        (3, 2, 'Performance Issues', 'CodeFlow is running very slowly when working with large projects. Any suggestions to improve performance?', '2024-06-21 16:45:00'),
        (4, 2, 'Billing Problem', 'I was charged twice for FunStream this month. Please assist in resolving the billing error.', '2024-06-20 10:00:00'),
        (5, 2, 'Feature Request', 'Would love to see a dark mode option in ChatSphere for better usability at night.', '2024-06-19 12:30:00');
        
        -- Ticket Replies
        INSERT INTO TICKET_REPLIES (TICKETID, REPLY) VALUES 
        (3, 'Thank you for reaching out. To improve the performance of CodeFlow with large projects, please ensure you have the latest updates installed, increase the allocated RAM in the settings, close any unnecessary background applications, and consider using an SSD for faster read/write speeds. If the issue persists, please provide us with more details about your project setup.'),
        (4, 'We apologize for the inconvenience caused by the billing error. Our billing team has identified the issue, and you will be refunded the extra charge within 3-5 business days. If you have any further questions or concerns, please don''t hesitate to contact us.'),
        (5, 'Thank you for your feature request. We are happy to inform you that a dark mode option is already in development and will be included in the next update of ChatSphere. We appreciate your feedback and strive to enhance your user experience.');
        
        -- Ticket Products
        INSERT INTO TICKETPRODUTO (TICKETID, PRODUCTID) VALUES 
        (1, 1),
        (2, 2),
        (3, 3),
        (4, 4),
        (5, 5);
        
        -- Versions
        INSERT INTO VERSION (PRODUCTID, ADDONID, VERSION, STATUSID, RELEASENOTES, RELEASEDATE, DOWNLOADLINK, REQID) VALUES 
        (1, NULL, '1.0.0', 2, 'Initial release of CreatiVortex with core design tools.', '2024-01-01', '(endereço web para download)', 1),
        (NULL, 1, '1.1.0', 2, 'Premium Design Templates addon for CreatiVortex.', '2024-02-01', '(endereço web para download)', NULL),
        (NULL, 2, '1.2.0', 2, 'Enhanced Collaboration Tools addon for CreatiVortex.', '2024-03-01', '(endereço web para download)', NULL),
        (6, NULL, '1.0.0', 2, 'Initial release of DesignSphere with comprehensive design tools.', '2024-01-01', '(endereço web para download)', 6),
        (2, NULL, '1.0.0', 2, 'Initial release of TaskMaster with task management features.', '2024-01-01', '(endereço web para download)', 2),
        (NULL, 3, '1.1.0', 2, 'Time Tracking and Analytics addon for TaskMaster.', '2024-02-01', '(endereço web para download)', NULL),
        (3, NULL, '1.0.0', 2, 'Initial release of CodeFlow with advanced code editor.', '2024-01-01', '(endereço web para download)', 3),
        (NULL, 4, '1.1.0', 2, 'Voice Command Integration addon for CodeFlow.', '2024-02-01', '(endereço web para download)', NULL),
        (4, NULL, '1.0.0', 2, 'Initial release of FunStream with high-quality streaming capabilities.', '2024-01-01', '(endereço web para download)', 4),
        (NULL, 5, '1.1.0', 2, 'High-Quality Streaming addon for FunStream.', '2024-02-01', '(endereço web para download)', NULL),
        (5, NULL, '1.0.0', 2, 'Initial release of ChatSphere with communication tools.', '2024-01-01', '(endereço web para download)', 5);
      `);}
/*
controller.filme_detail = async (req, res) => { ////Precisa de async, pois a página front-end dá erro, se não tiver filmes para listar
    const itemId = req.params.id; //Id atribuido pelo parametro
    filmes.findOne({ //Encontra o primeiro que...
        where: {
            id: itemId //tenha o id igual ao do request
        },
        include: 'genero' //Inclui o género
    }).then(item => {
        if (item) res.json(item); //Se o filme existir, retorna o json. Isto previne erros quando o utilizador escreve o id direto no URL da página.
    })
}



//Editar o filme
controller.filme_update = async (req, res) => {
    const itemId = req.params.id; //Recebemos o id atraves dos parametros

    filmes.findByPk(itemId) //Procuramos o ficheiro pela Primary Key
        .then(item => { //Então...
            if (item) { //Verificamos se a pesquisa encontrou algo, se sim edita com a informação introduzida pelo utilizador.
                item.descricao = req.body.descricao;
                item.titulo = req.body.titulo;
                (req.file) ? item.foto = req.file.filename : item.foto = item.foto; //Verificamos se o multer fez upload de algum ficheiro, se sim altera o item.foto, se não o item.foto mantém-se o mesmo
                item.generoid = req.body.generoid;
                return item.save();
            }
        })
        .then(item => {
            if (item) { //Se o item for encontrado no "findByPk" e passar pelo return...
                res.json(item); //Devolvemo-lo, com as novas informações
            }
        })
}

//Remover o filme
controller.filme_delete = (req, res) => {
    const itemId = req.params.id; //Procura o ID nos parametros
    filmes.destroy({ //Apaga o filme que...
        where: {
            id: itemId //...tiver o id igual ao parametro
        }
    }).then(res.send()) //Devolve o código 200 (de sucesso)
}

//Contagem dos filmes
controller.filmes_count = async (req, res) => {
    await filmes.count() //Conta quantos filmes existem na base de dados
        .then(count => {
            res.send(count.toString()); //Devolve a contagem
        })
}

//Contagem dos filmes por géneros
controller.filme_genero_count = async (req, res) => {
    await filmes.findAll({
        attributes: ['generoid', [sequelize.fn('COUNT', sequelize.col('*')), 'filme_count']], //Faz a contagem de generoid para a coluna "filme_count"
        group: ['generoid', 'genero.id'], //Agrupa por género
        include: [{
            model: generos,
            attributes: ['id', 'designacao'], //Inclui o nome e o id do género
        }]
    }).then(data => {
        res.json(data); //Devolve todas as contagens, mas apenas os generos que têm filmes, para os géneros sem filmes é feita outra query em home.js (frontend)
    })
}
    */
module.exports = controller;