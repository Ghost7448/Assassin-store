const {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder,
    REST,
    Routes,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField,
    ChannelType,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    InteractionType
} = require('discord.js');

require('dotenv').config();

const fs = require('fs');

const discordTranscripts = require('discord-html-transcripts');

let ticketEmbed;
let ticketRow;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('clientReady', async () => {

    console.log(`${client.user.tag} جاهز`);


    ticketEmbed = new EmbedBuilder()
        .setColor('#242424')
        .setTitle(' Assassin Store Center <a:Assassin1:1517255845639880734>')
        .setDescription(`
# Server Tickets <:Tickets:1517289418140946454>
## Gamming Hub 🎮
### PUBG <:Pubg:1517293555406864575> 
** لشراء شدات ببجي اضغط هنا **
### Free Fire <:FreeFire:1517293461164785736> 
** لشراء جواهر فري فاير اضفط هنا **
### Steam Games <:Steam:1517293732997632172> 
** لشراء العاب ستيم اضغط هنا **
### Custom Bot 🤖
** لطلب او انشاء بوت ديسكورد اضغط هنا **
### Nitro  💎
** لشراء النايترو اضغط هنا **

## Content Creator Hub 🚀
### Premium Designs⚡
** للحصول علي تصميمات احترافيه اضغط هنا **
### Elite Graphics 💎
** للحصول علي جرافيك عالي الجوده اضغط هنا **
### Video Editing 🎬
** للحصول علي تعديلات احترافيه اضغط هنا **
### Thumbnail Orders 🖼️ 
** لانشاء صور معدله اضغط هنا **

> ** اختر المنتج المطلوب وسيتم الرد عليك في اسرع وقت. **
        `)
        .setImage('https://i.postimg.cc/qqT42tst/file-00000000071071f482e5b9cfefa85b2f.jpg')
        .setFooter({
            text: 'Assassin Store Ticket System '
        });

    const menu = new StringSelectMenuBuilder()
        .setCustomId('ticket_menu')
        .setPlaceholder('اختر الخدمة')
        .addOptions([
           {
    label: 'PUBG',
    value: 'pubg',
    description: 'شراء شدات ببجي',
    emoji: '<:Pubg:1517293555406864575>'
},
{
    label: 'Free Fire',
    value: 'freefire',
    description: 'شراء جواهر فري فاير',
    emoji: '<:FreeFire:1517293461164785736>'
},
{
    label: 'Steam Games',
    value: 'steam_games',
    description: 'شراء ألعاب ستيم',
    emoji: '<:Steam:1517293732997632172>'
},
{
    label: 'Custom Bot',
    value: 'custom_bot',
    description: 'طلب أو إنشاء بوت ديسكورد',
    emoji: '🤖'
},
{
    label: 'Nitro',
    value: 'nitro',
    description: 'شراء Discord Nitro',
    emoji: '💎'
},
{
    label: 'Premium Designs',
    value: 'premium_designs',
    description: 'تصاميم احترافية',
    emoji: '⚡'
},  
{
    label: 'Elite Graphics',
    value: 'elite_graphics',
    description: 'جرافيك عالي الجودة',
    emoji: '💎'
},
{
    label: 'Video Editing',
    value: 'video_editing',
    description: 'طلبات المونتاج',
    emoji: '🎬'
},
{
    label: 'Thumbnail Orders',
    value: 'thumbnail_orders',
    description: 'طلبات الصور المصغرة',
    emoji: '🖼️'
},
            
        ]);

    ticketRow = new ActionRowBuilder().addComponents(menu);


});

client.on('interactionCreate', async interaction => {

    if (interaction.isChatInputCommand()) {

    if (interaction.commandName === 'ticket') {

        if (
            !interaction.member.roles.cache.has(process.env.TICKET_PANEL_ROLE)
        ) {
            return interaction.reply({
                content: '❌ ليس لديك صلاحية',
                ephemeral: true
            });
        }

await interaction.reply({
    embeds: [ticketEmbed],
    components: [ticketRow],
    ephemeral: false
});

    }
}

if (interaction.commandName === 'order') {

    if (
        !interaction.member.roles.cache.has(process.env.TICKET_PANEL_ROLE)
    ) {
        return interaction.reply({
            content: '❌ ليس لديك صلاحية',
            ephemeral: true
        });
    }

    const modal = new ModalBuilder()
        .setCustomId('order_form')
        .setTitle('إنشاء طلب جديد');

    const productName = new TextInputBuilder()
        .setCustomId('product_name')
        .setLabel('اسم الطلب')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const quantity = new TextInputBuilder()
        .setCustomId('quantity')
        .setLabel('الكمية')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

    const price = new TextInputBuilder()
        .setCustomId('price')
        .setLabel('سعر المنتج')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const discordId = new TextInputBuilder()
        .setCustomId('discord_id')
        .setLabel('Discord ID')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const paymentStatus = new TextInputBuilder()
        .setCustomId('payment_status')
        .setLabel('حالة الدفع')
        .setPlaceholder('تم الدفع / لم يتم الدفع')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

   modal.addComponents(
    new ActionRowBuilder().addComponents(productName),
    new ActionRowBuilder().addComponents(quantity),
    new ActionRowBuilder().addComponents(price),
    new ActionRowBuilder().addComponents(discordId),
    new ActionRowBuilder().addComponents(paymentStatus)
);

    return interaction.showModal(modal);
}

if (interaction.isChatInputCommand() && interaction.commandName === 'pay') {

    if (!interaction.member.roles.cache.some(role => allowedRoles.includes(role.id))) {
        return interaction.reply({
            content: '❌ ليس لديك صلاحية لاستخدام هذا الأمر.',
            flags: 64
        });
    }

    const payEmbed = new EmbedBuilder()
        .setColor('#242424')
        .setAuthor({
            name: `${interaction.user.username}`,
            iconURL: "https://i.postimg.cc/SQg6NBWr/download.gif"
        })
        .setTitle('Payment Methods💳')
        .setDescription(`**VF Cash <:Vodafone:1516829428838043769> 
01023019916  

 Etisalat Cash <:eCash:1517781143196274708> 
01101881816  

 Insta Pay <:instapay:1516829472593285170> 
assassin0@instapay  
assassin20@instapay  

جميع طرق الدفع متاحة**  
شكرا لتعاملك معنا ❤️`)
        .setFooter({
            text: 'Assassin Store Payment System'
        });

    return interaction.reply({
        embeds: [payEmbed],
    });
}

if (interaction.isChatInputCommand() && interaction.commandName === 'feedback') {

    if (!interaction.member.roles.cache.some(role => allowedRoles.includes(role.id))) {
        return interaction.reply({
            content: '❌ ليس لديك صلاحية لاستخدام هذا الأمر.',
            flags: 64
        });
    }

    const embed = new EmbedBuilder()
        .setColor('#242424')
        .setTitle('Feedback System ⭐')
        .setDescription('### نشكرك على وقتك وثقتك بنا ونرجو منك تقييم تجربتك معنا من خلال الأزرار الموجودة بالأسفل اراؤكم محل اهتمام كبير لدينا حيث تساعدنا بشكل مباشر على تحسین جودة الخدمة وتطوير الأدا بشكل مستمر لتقديم تجربة أفضل للجميع لا تتردد في اختيار التقييم الذي يعكس تجربتك بكل شفافيه')
        .setThumbnail('https://i.postimg.cc/SQg6NBWr/download.gif');

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('rate_1').setLabel('★').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('rate_2').setLabel('★★').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('rate_3').setLabel('★★★').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('rate_4').setLabel('★★★★').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('rate_5').setLabel('★★★★★').setStyle(ButtonStyle.Secondary)
    );

    return interaction.reply({
        embeds: [embed],
        components: [row]
    });
}

if (interaction.commandName === 'wait') {

    if (!interaction.member.roles.cache.has(process.env.DEV_ROLE_ID)) {
    return interaction.reply({
        content: '❌ ليس لديك صلاحية لاستخدام هذا الأمر',
        flags: 64
    });
    }

    const modal = new ModalBuilder()
        .setCustomId('wait_form')
        .setTitle('حالة تطوير البوت');

    const userId = new TextInputBuilder()
        .setCustomId('user_id')
        .setLabel('Discord ID')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    modal.addComponents(
        new ActionRowBuilder().addComponents(userId)
    );

    return interaction.showModal(modal);
}

if (interaction.isChatInputCommand() && interaction.commandName === 'done') {

    if (!interaction.member.roles.cache.has(process.env.DEV_ROLE_ID)) {
    return interaction.reply({
        content: '❌ ليس لديك صلاحية لاستخدام هذا الأمر',
        flags: 64
    });
    }

    const modal = new ModalBuilder()
        .setCustomId('done_form')
        .setTitle('تسليم البوت');

    const userId = new TextInputBuilder()
        .setCustomId('user_id')
        .setLabel('Discord ID')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const downloadLink = new TextInputBuilder()
        .setCustomId('download_link')
        .setLabel('رابط تحميل البوت')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    modal.addComponents(
        new ActionRowBuilder().addComponents(userId),
        new ActionRowBuilder().addComponents(downloadLink)
    );

    return interaction.showModal(modal);
}

if (interaction.isChatInputCommand() && interaction.commandName === 'test') {

    if (!interaction.member.roles.cache.has(process.env.DEV_ROLE_ID)) {
    return interaction.reply({
        content: '❌ ليس لديك صلاحية لاستخدام هذا الأمر',
        flags: 64
    });
    }

    const modal = new ModalBuilder()
        .setCustomId('test_form')
        .setTitle('حالة اختبار البوت');

    const userId = new TextInputBuilder()
        .setCustomId('user_id')
        .setLabel('Discord ID')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    modal.addComponents(
        new ActionRowBuilder().addComponents(userId)
    );

    return interaction.showModal(modal);
}

if (interaction.isChatInputCommand() && interaction.commandName === 'cancel') {

    if (!interaction.member.roles.cache.has(process.env.DEV_ROLE_ID)) {
    return interaction.reply({
        content: '❌ ليس لديك صلاحية لاستخدام هذا الأمر',
        flags: 64
    });
    }

    const modal = new ModalBuilder()
        .setCustomId('cancel_form')
        .setTitle('إلغاء الطلب');

    const userId = new TextInputBuilder()
        .setCustomId('user_id')
        .setLabel('Discord ID')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const reason = new TextInputBuilder()
        .setCustomId('reason')
        .setLabel('سبب الإلغاء')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

    modal.addComponents(
        new ActionRowBuilder().addComponents(userId),
        new ActionRowBuilder().addComponents(reason)
    );

    return interaction.showModal(modal);
}

if (interaction.commandName === 'signup') {

    if (
        !interaction.member.roles.cache.has(process.env.TICKET_PANEL_ROLE)
    ) {
        return interaction.reply({
            content: '❌ ليس لديك صلاحية',
            ephemeral: true
        });
    }

    const embed = new EmbedBuilder()
        .setColor('#242424')
        .setAuthor({
            name: 'Assassin Store',
            iconURL: 'https://i.postimg.cc/SQg6NBWr/download.gif'
        })
        .setTitle('Account Registration')
        .setDescription(`**
أهلاً بك في Assassin's Store

لإنشاء حسابك داخل المتجر اضغط على الزر بالأسفل.

سيتم تسجيل:
• الاسم
• البريد الإلكتروني

ثم إنشاء حساب خاص بك داخل نظام المتجر.
        **`)
        .setFooter({
            text: 'Assassin Store Accounts System'
        });

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('signup_button')
            .setLabel('Sign Up')
            .setStyle(ButtonStyle.Success)
            .setEmoji('📝')
    );

    return interaction.reply({
        embeds: [embed],
        components: [row]
    });
}

if (interaction.commandName === 'account') {

    const discordId =
        interaction.options.getString('discord_id');

    const accounts = JSON.parse(
        fs.readFileSync('./accounts.json', 'utf8')
    );

    if (!accounts[discordId]) {
        return interaction.reply({
            content: '❌ لا يوجد حساب لهذا الشخص',
            flags: 64
        });
    }

    let user;

    try {
        user = await client.users.fetch(discordId);
    } catch {
        return interaction.reply({
            content: '❌ لم يتم العثور على المستخدم',
            flags: 64
        });
    }

    const data = accounts[discordId];

    const embed = new EmbedBuilder()
        .setColor('#242424')
        .setAuthor({
            name: user.username,
            iconURL: user.displayAvatarURL({ dynamic: true })
        })
        .setThumbnail(
            user.displayAvatarURL({ dynamic: true, size: 1024 })
        )
        .setTitle('📊 Account Information')
        .addFields(
            {
                name: '🆔 Discord ID',
                value: discordId
            },
            {
                name: '👤 الاسم',
                value: data.name
            },
            {
                name: '📧 Email',
                value: data.email
            },
            {
                name: '🎫 Tickets Opened',
                value: String(data.tickets)
            },
            {
                name: '📦 Paid Orders',
                value: String(data.orders)
            },
            {
                name: '💰 Total Spent',
                value: `${data.spent} EGP`
            }
        )
        .setFooter({
            text: 'Assassin Store Accounts System'
        })
        .setTimestamp();

    return interaction.reply({
        embeds: [embed]
    });
}

    // ================= SELECT MENU =================
    if (interaction.isStringSelectMenu()) {

        if (interaction.customId === 'ticket_menu') {
          
            await interaction.deferReply({ flags: 64 });

            const value = interaction.values[0];

            let product = '';
            let paymentMethods = '';

            if (value === 'pubg') {
                product = '** PUBG <:Pubg:1517293555406864575> **';
                paymentMethods = `
** طرق الدفع: 💳 **
### • Vodafone Cash <:Vodafone:1516829428838043769>
### • Insta Pay <:instapay:1516829472593285170>
### • PayPal <:paypal:1516829452720410624>
    `;
            }

            if (value === 'freefire') {
                product = '** Free Fire <:FreeFire:1517293461164785736> ** ';
                paymentMethods = `
** طرق الدفع: 💳 **
### • Vodafone Cash <:Vodafone:1516829428838043769>
### • Insta Pay <:instapay:1516829472593285170>
### • PayPal <:paypal:1516829452720410624>
    `;
            }
            if (value === 'nitro') {
                product = '** Discord Nitro 💎 **';
                paymentMethods = `
** طرق الدفع: 💳 **
### • Vodafone Cash <:Vodafone:1516829428838043769>
### • Insta Pay <:instapay:1516829472593285170>
### • PayPal <:paypal:1516829452720410624>
    `;
            }
if (value === 'video_editing') {
    product = '** Video Editing 🎬 **';
    paymentMethods = `
** طرق الدفع: 💳 **
### • Vodafone Cash <:Vodafone:1516829428838043769>
### • Insta Pay <:instapay:1516829472593285170>
### • PayPal <:paypal:1516829452720410624>
    `;
}

if (value === 'thumbnail_orders') {
    product = '** Thumbnail Orders 🖼️ **';
    paymentMethods = `
** طرق الدفع: 💳 **
### • Vodafone Cash <:Vodafone:1516829428838043769>
### • Insta Pay <:instapay:1516829472593285170>
### • PayPal <:paypal:1516829452720410624>
    `;
}

if (value === 'premium_designs') {
    product = '** Premium Designs ⚡ **';
    paymentMethods = `
** طرق الدفع: 💳 **
### • Vodafone Cash <:Vodafone:1516829428838043769>
### • Insta Pay <:instapay:1516829472593285170>
### • PayPal <:paypal:1516829452720410624>
    `;
}

if (value === 'elite_graphics') {
    product = '** Elite Graphics 💎 **';
    paymentMethods = `
** طرق الدفع: 💳 **
### • Vodafone Cash <:Vodafone:1516829428838043769>
### • Insta Pay <:instapay:1516829472593285170>
### • PayPal <:paypal:1516829452720410624>
    `;
}

if (value === 'steam_games') {
    product = '** Steam Games <:Steam:1517293732997632172> **';
    paymentMethods = `
** طرق الدفع: 💳 **
### • Vodafone Cash <:Vodafone:1516829428838043769>
### • Insta Pay <:instapay:1516829472593285170>
### • PayPal <:paypal:1516829452720410624>
    `;
}

if (value === 'custom_bot') {
    product = '** Custom Bot 🤖 **';
    paymentMethods = `
** طرق الدفع: 💳 **
### • Vodafone Cash <:Vodafone:1516829428838043769>
### • Insta Pay <:instapay:1516829472593285170>
### • PayPal <:paypal:1516829452720410624>
    `;
}
            

            let prefix = '';
            if (value === 'pubg') prefix = 'pubg';
            if (value === 'freefire') prefix = 'freefire';
            if (value === 'nitro') prefix = 'nitro';
            if (value === 'video_editing') prefix = 'video';
            if (value === 'thumbnail_orders') prefix = 'thumbnail';
            if (value === 'premium_designs') prefix = 'design';
            if (value === 'elite_graphics') prefix = 'graphics';
            if (value === 'steam_games') prefix = 'steam';
            if (value === 'custom_bot') prefix = 'bot';

            const channel = await interaction.guild.channels.create({
                name: `${prefix}-ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: process.env.TICKET_CATEGORY_ID,

                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: interaction.user.id,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory
                        ]
                    },
                    {
                        id: process.env.STAFF_ROLE_ID,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory
                        ]
                    }
                ]
            });

            const ticketEmbed = new EmbedBuilder()
                .setColor('#242424')
                .setTitle('📄 فاتورة شراء')
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`
👤 العميل:
${interaction.user}

** 🛒 المنتج: **
> ${product}

** اكتب الكمية المطلوبة داخل التكت. 📌 **

${paymentMethods}

**  بعد التحويل ارسل صورة التحويل. ⚠️ **
                `)
                .setImage('https://i.postimg.cc/qqT42tst/file-00000000071071f482e5b9cfefa85b2f.jpg')
                .setFooter({
                    text: ' Store Invoice System '
                });

           const buttons = new ActionRowBuilder().addComponents(

    new ButtonBuilder()
        .setCustomId('create_invoice')
        .setLabel('انشاء فاتورة')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🧾'),

    new ButtonBuilder()
        .setCustomId('claim_ticket')
        .setLabel('استلام التذكرة')
        .setStyle(ButtonStyle.Success)
        .setEmoji('✅'),

    new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('اغلاق التذكرة')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🔒'),

    new ButtonBuilder()
        .setCustomId('delete_ticket')
        .setLabel('حذف التذكرة')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🗑️')
);

const accounts = JSON.parse(
    fs.readFileSync('./accounts.json', 'utf8')
);

if (accounts[interaction.user.id]) {

    accounts[interaction.user.id].tickets += 1;

    fs.writeFileSync(
        './accounts.json',
        JSON.stringify(accounts, null, 2)
    );
}

            await channel.send({
                content: `<@&${process.env.STAFF_ROLE_ID}> ${interaction.user}`,
                embeds: [ticketEmbed],
                components: [buttons]
            });

            return interaction.editReply({
                content: `✅ تم إنشاء التذكرة ${channel}`,
            });
        }
    }

    // ================= BUTTONS =================
    if (interaction.isButton()) {

        if (
    interaction.customId === 'rate_1' ||
    interaction.customId === 'rate_2' ||
    interaction.customId === 'rate_3' ||
    interaction.customId === 'rate_4' ||
    interaction.customId === 'rate_5'
) {

    const rating = parseInt(interaction.customId.replace('rate_', ''));

    const modal = new ModalBuilder()
        .setCustomId(`feedback_${rating}`)
        .setTitle('Customer Review');

    const comment = new TextInputBuilder()
        .setCustomId('comment')
        .setLabel('اكتب تعليقك')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

    modal.addComponents(
        new ActionRowBuilder().addComponents(comment)
    );

    return interaction.showModal(modal);
}

        // CLAIM
if (interaction.customId === 'claim_ticket') {

    const allowedRoles = [
    process.env.CLAIM_ROLE_ID,
    process.env.CLAIM_ROLE_ID_2,
];

const hasPermission = interaction.member.roles.cache.some(role =>
    allowedRoles.includes(role.id)
);

if (!hasPermission) {
    return interaction.reply({
        content: '❌ ليس لديك صلاحية لاستلام التذاكر',
        flags: 64
    });
}

if (interaction.channel.name.startsWith('claimed-')) {
    return interaction.reply({
        content: '❌ التذكرة مستلمة بالفعل',
        flags: 64
    });
}

    const oldName = interaction.channel.name;

    await interaction.channel.setName(`claimed-${oldName}`);

    const claimEmbed = new EmbedBuilder()
        .setColor('#5eff00')
        .setTitle('✅ تم استلام التذكرة')
        .setDescription(`
تم استلام التذكرة بواسطة ${interaction.user}

سيتم الرد عليك في اقرب وقت.
        `)
        .setTimestamp();

    await interaction.reply({
        embeds: [claimEmbed]
    });

    const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);

    const logEmbed = new EmbedBuilder()
        .setColor('#5eff00')
        .setTitle('📌 Ticket Claimed')
        .setDescription(`
👤 الموظف:
${interaction.user}

📁 التذكرة:
${interaction.channel}
        `)
        .setTimestamp();

    await logChannel.send({
        embeds: [logEmbed]
    });
}

       // CLOSE
if (interaction.customId === 'close_ticket') {

    const channel = interaction.channel;

    if (channel.name.startsWith('closed-')) {
    return interaction.reply({
        content: '❌ التذكرة مغلقة بالفعل',
        flags: 64
    });
}

    await channel.setName(`closed-${channel.name}`);

    const closeEmbed = new EmbedBuilder()
        .setColor('#ffc400')
        .setTitle('🔒 تم إغلاق التذكرة')
        .setDescription(`
تم إغلاق التذكرة بواسطة ${interaction.user}

شكراً لتعاملك معنا.
        `)
        .setTimestamp();

    await interaction.reply({
        embeds: [closeEmbed]
    });

    const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);

    const logEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('🔒 Ticket Closed')
        .setDescription(`
👤 بواسطة:
${interaction.user}

📁 التذكرة:
${channel.name}
        `)
        .setTimestamp();

    await logChannel.send({
        embeds: [logEmbed]
    });
}

        if (interaction.customId === 'delete_ticket') {

            const allowedRoles = [
    process.env.CLAIM_ROLE_ID,
    process.env.CLAIM_ROLE_ID_2,
];

const hasPermission = interaction.member.roles.cache.some(role =>
    allowedRoles.includes(role.id)
);

if (!hasPermission) {
    return interaction.reply({
        content: '❌ ليس لديك صلاحية لحذف التذاكر',
        flags: 64
    });
}

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('تم طلب حذف التذكره')
                        .setDescription('سيتم الحذف خلال ثواني')
                ]
            });

            const attachment = await discordTranscripts.createTranscript(
    interaction.channel,
    {
        limit: -1,
        returnType: 'attachment',
        filename: `${interaction.channel.name}.html`
    }
);

const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);

await logChannel.send({
   embeds: [
    new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('📄 Ticket Transcript')
        .addFields(
            { name: 'التذكرة', value: interaction.channel.name },
            { name: 'تم الحذف بواسطة', value: `${interaction.user}` }
        )
        .setTimestamp()
],
files: [attachment]
});

            setTimeout(() => interaction.channel.delete(), 5000);
            
        }

        // create invoice 
        if (interaction.customId === 'create_invoice') {

const type = interaction.channel.name.toLowerCase();

if (
    !type.includes('pubg') &&
    !type.includes('freefire') &&
    !type.includes('nitro') &&
    !type.includes('steam') &&
    !type.includes('video') &&
    !type.includes('thumbnail') &&
    !type.includes('graphics') &&
    !type.includes('design') &&
    !type.includes('bot')

) {
    return interaction.reply({
        content: '❌ لا يمكن تحديد نوع التذكرة',
        flags: 64
    });
}
            let modal = new ModalBuilder();

if (type.includes('pubg')) {

    modal.setCustomId('invoice_pubg');
    modal.setTitle('PUBG Invoice');

    const name = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('اسم العميل')
        .setStyle(TextInputStyle.Short);

    const uc = new TextInputBuilder()
        .setCustomId('uc')
        .setLabel('كمية الـ UC')
        .setStyle(TextInputStyle.Short);

    const method = new TextInputBuilder()
        .setCustomId('method')
        .setLabel('ID ولا Account')
        .setStyle(TextInputStyle.Short);

    modal.addComponents(
        new ActionRowBuilder().addComponents(name),
        new ActionRowBuilder().addComponents(uc),
        new ActionRowBuilder().addComponents(method)
    );
}

if (type.includes('freefire')) {

    modal.setCustomId('invoice_freefire');
    modal.setTitle('Free Fire Invoice');

    const name = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('اسم العميل')
        .setStyle(TextInputStyle.Short);

    const diamonds = new TextInputBuilder()
        .setCustomId('diamonds')
        .setLabel('كمية الجواهر')
        .setStyle(TextInputStyle.Short);

    const method = new TextInputBuilder()
        .setCustomId('method')
        .setLabel('ID ولا Account')
        .setStyle(TextInputStyle.Short);

    modal.addComponents(
        new ActionRowBuilder().addComponents(name),
        new ActionRowBuilder().addComponents(diamonds),
        new ActionRowBuilder().addComponents(method)
    );
}

if (type.includes('nitro')) {

    modal.setCustomId('invoice_nitro');
    modal.setTitle('Nitro Invoice');

    const name = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('اسم العميل')
        .setStyle(TextInputStyle.Short);

    const duration = new TextInputBuilder()
        .setCustomId('duration')
        .setLabel('Month / 3 Month / Year')
        .setStyle(TextInputStyle.Short);

    modal.addComponents(
        new ActionRowBuilder().addComponents(name),
        new ActionRowBuilder().addComponents(duration)
    );
}

if (type.includes('steam')) {

    modal.setCustomId('invoice_steam');
    modal.setTitle('Steam Games Invoice');

    const name = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('اسم العميل')
        .setStyle(TextInputStyle.Short);

    const game = new TextInputBuilder()
        .setCustomId('game')
        .setLabel('اسم اللعبة')
        .setStyle(TextInputStyle.Short);

    modal.addComponents(
        new ActionRowBuilder().addComponents(name),
        new ActionRowBuilder().addComponents(game)
    );
}

if (type.includes('video')) {

    modal.setCustomId('invoice_video');
    modal.setTitle('Video Editing Invoice');

    const name = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('اسم العميل')
        .setStyle(TextInputStyle.Short);

    const videoType = new TextInputBuilder()
        .setCustomId('video_type')
        .setLabel('نوع الفيديو')
        .setStyle(TextInputStyle.Short);

    const duration = new TextInputBuilder()
        .setCustomId('duration')
        .setLabel('مدة الفيديو')
        .setStyle(TextInputStyle.Short);

    modal.addComponents(
        new ActionRowBuilder().addComponents(name),
        new ActionRowBuilder().addComponents(videoType),
        new ActionRowBuilder().addComponents(duration)
    );
}

if (type.includes('thumbnail')) {

    modal.setCustomId('invoice_thumbnail');
    modal.setTitle('Thumbnail Invoice');

    const name = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('اسم العميل')
        .setStyle(TextInputStyle.Short);

    const thumbTitle = new TextInputBuilder()
        .setCustomId('thumb_title')
        .setLabel('عنوان الثمبنيل')
        .setStyle(TextInputStyle.Short);

    const size = new TextInputBuilder()
        .setCustomId('size')
        .setLabel('مقاس الصورة')
        .setStyle(TextInputStyle.Short);

    modal.addComponents(
        new ActionRowBuilder().addComponents(name),
        new ActionRowBuilder().addComponents(thumbTitle),
        new ActionRowBuilder().addComponents(size)
    );
}

if (type.includes('graphics')) {

    modal.setCustomId('invoice_graphics');
    modal.setTitle('Elite Graphics Invoice');

    const name = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('اسم العميل')
        .setStyle(TextInputStyle.Short);

    const designType = new TextInputBuilder()
        .setCustomId('design_type')
        .setLabel('نوع التصميم')
        .setStyle(TextInputStyle.Short);

    const details = new TextInputBuilder()
        .setCustomId('details')
        .setLabel('تفاصيل الطلب')
        .setStyle(TextInputStyle.Paragraph);

    modal.addComponents(
        new ActionRowBuilder().addComponents(name),
        new ActionRowBuilder().addComponents(designType),
        new ActionRowBuilder().addComponents(details)
    );
}

if (type.includes('bot')) {

    modal.setCustomId('invoice_bot');
    modal.setTitle('Custom Bot Invoice');

    const name = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('اسم العميل')
        .setStyle(TextInputStyle.Short);

    const botName = new TextInputBuilder()
        .setCustomId('bot_name')
        .setLabel('اسم البوت')
        .setStyle(TextInputStyle.Short);

    const botDescription = new TextInputBuilder()
        .setCustomId('bot_description')
        .setLabel('وصف البوت')
        .setStyle(TextInputStyle.Paragraph);

    const similarBot = new TextInputBuilder()
        .setCustomId('similar_bot')
        .setLabel('رابط بوت مشابه (إن وجد)')
        .setRequired(false)
        .setStyle(TextInputStyle.Short);

    modal.addComponents(
        new ActionRowBuilder().addComponents(name),
        new ActionRowBuilder().addComponents(botName),
        new ActionRowBuilder().addComponents(botDescription),
        new ActionRowBuilder().addComponents(similarBot)
    );
}

if (type.includes('design')) {

    modal.setCustomId('invoice_design');
    modal.setTitle('Premium Designs Invoice');

    const name = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('اسم العميل')
        .setStyle(TextInputStyle.Short);

    const designType = new TextInputBuilder()
        .setCustomId('design_type')
        .setLabel('نوع التصميم')
        .setStyle(TextInputStyle.Short);

    const details = new TextInputBuilder()
        .setCustomId('details')
        .setLabel('تفاصيل الطلب')
        .setStyle(TextInputStyle.Paragraph);

    modal.addComponents(
        new ActionRowBuilder().addComponents(name),
        new ActionRowBuilder().addComponents(designType),
        new ActionRowBuilder().addComponents(details)
    );
}

            return interaction.showModal(modal);
        }
    }

    if (interaction.customId === 'signup_button') {

    const modal = new ModalBuilder()
        .setCustomId('signup_modal')
        .setTitle('Create Account');

    const name = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('الاسم')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const email = new TextInputBuilder()
        .setCustomId('email')
        .setLabel('Email')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    modal.addComponents(
        new ActionRowBuilder().addComponents(name),
        new ActionRowBuilder().addComponents(email)
    );

    return interaction.showModal(modal);
}

    // ================= MODAL =================
    if (interaction.type === InteractionType.ModalSubmit) {

        if (interaction.type === InteractionType.ModalSubmit) {

    if (interaction.customId.startsWith('feedback_')) {

        const rating = parseInt(
            interaction.customId.replace('feedback_', '')
        );

        const comment =
            interaction.fields.getTextInputValue('comment');

        const stars = '★'.repeat(rating);

        let level = '';

        if (rating === 1) level = 'يحتاج تحسين';
        if (rating === 2) level = 'مقبول';
        if (rating === 3) level = 'جيد';
        if (rating === 4) level = 'ممتاز';
        if (rating === 5) level = 'تجربة استثنائية تستحق العرض';

        const feedbackChannel = client.channels.cache.get(
            process.env.FEEDBACK_CHANNEL_ID
        );

        const feedbackEmbed = new EmbedBuilder()
            .setColor('#242424')
            .setAuthor({
                name: 'Assassin Store • Customer Review',
                iconURL: 'https://i.postimg.cc/SQg6NBWr/download.gif'
            })
            .setTitle('★Feedback Showcase')
            .setDescription(
                `${interaction.user} شاركنا تقييمه بعد الانتهاء من الطلب.`
            )
            .addFields(
                {
                    name: 'التقييم',
                    value: `${stars} (${rating}/5)`,
                    inline: false
                },
                {
                    name: 'مستوى الرضا',
                    value: level,
                    inline: false
                },
                {
                    name: 'تعليق العميل',
                    value: comment,
                    inline: false
                },
                {
                    name: 'صاحب التقييم',
                    value: `${interaction.user.username}\n(${interaction.user.id})`,
                    inline: false
                }
            )
            .setThumbnail(
                interaction.user.displayAvatarURL({
                    dynamic: true,
                    size: 1024
                })
            )
            .setImage(
                'https://i.postimg.cc/cLnwh6Vy/file-00000000071071f482e5b9cfefa85b2f.png'
            )
            .setFooter({
                text: `${interaction.user.username} • ${new Date().toLocaleString()}`
            });

        await feedbackChannel.send({
            embeds: [feedbackEmbed]
        });

        return interaction.reply({
            content: '✅ شكراً على تقييمك',
            flags: 64
        });
    }
}

if (interaction.customId === 'signup_modal') {

    const name =
        interaction.fields.getTextInputValue('name');

    const email =
        interaction.fields.getTextInputValue('email');

    const accounts = JSON.parse(
        fs.readFileSync('./accounts.json', 'utf8')
    );

    if (accounts[interaction.user.id]) {
        return interaction.reply({
            content: '❌ لديك حساب بالفعل',
            flags: 64
        });
    }

    accounts[interaction.user.id] = {
        name: name,
        email: email,
        tickets: 0,
        orders: 0,
        spent: 0
    };

    fs.writeFileSync(
        './accounts.json',
        JSON.stringify(accounts, null, 2)
    );

    const accountsChannel = client.channels.cache.get(
        process.env.ACCOUNTS_CHANNEL_ID
    );

    const embed = new EmbedBuilder()
        .setColor('#00ff88')
        .setTitle('✅ New Account')
        .setThumbnail(
            interaction.user.displayAvatarURL({ dynamic: true })
        )
        .addFields(
            {
                name: '👤 الاسم',
                value: name
            },
            {
                name: '📧 Email',
                value: email
            },
            {
                name: '🆔 Discord ID',
                value: interaction.user.id
            },
            {
                name: '🎫 Tickets',
                value: '0'
            },
            {
                name: '📦 Orders',
                value: '0'
            },
            {
                name: '💰 Total Spent',
                value: '0 EGP'
            }
        )
        .setTimestamp();

    await accountsChannel.send({
        embeds: [embed]
    });

    return interaction.reply({
        content: '✅ تم إنشاء حسابك بنجاح',
        flags: 64
    });
}

if (interaction.customId === 'order_form') {

    const discordId =
    interaction.fields.getTextInputValue('discord_id');

let user;

try {
    user = await client.users.fetch(discordId);
} catch {
    return interaction.reply({
        content: '❌ Discord ID غير صحيح',
        flags: 64
    });
}

    const embed = new EmbedBuilder()
    .setColor('#242424')
    .setTitle('🧾 Order Information')
    .setDescription(`
أهلاً بك ${user ? user : `<@${discordId}>`} في Assassin's Store ❤️
    `)
    .setThumbnail('https://i.postimg.cc/SQg6NBWr/download.gif')
    .addFields(
        {
            name: '📦 اسم الطلب',
            value: interaction.fields.getTextInputValue('product_name')
        },
        {
            name: '🔢 الكمية',
            value: interaction.fields.getTextInputValue('quantity') || 'غير محددة'
        },
        {
            name: '💰 سعر المنتج',
            value: interaction.fields.getTextInputValue('price')
        },
        {
            name: '🆔 Discord ID',
            value: discordId
        },
        {
            name: '💳 حالة الدفع',
            value: interaction.fields.getTextInputValue('payment_status')
        },
        {
            name: '👤 الموظف',
            value: `${interaction.user}`
        }
    )
    .setFooter({
        text: 'Assassin Store Order System'
    })
    .setTimestamp();

    const payment =
    interaction.fields.getTextInputValue('payment_status');

if (
    payment.includes('تم الدفع')
) {

    const accounts = JSON.parse(
        fs.readFileSync('./accounts.json', 'utf8')
    );

    if (accounts[discordId]) {

        accounts[discordId].orders += 1;

        accounts[discordId].spent += Number(
            interaction.fields.getTextInputValue('price')
        );

        fs.writeFileSync(
            './accounts.json',
            JSON.stringify(accounts, null, 2)
        );
    }
}

    return interaction.reply({
        embeds: [embed]
    });
}

    if (interaction.customId === 'wait_form') {

    const userId =
        interaction.fields.getTextInputValue('user_id');

    let user;

    try {
        user = await client.users.fetch(userId);
    } catch {
        return interaction.reply({
            content: '❌ ID غير صحيح',
            flags: 64
        });
    }

    const embed = new EmbedBuilder()
        .setColor('#ffd000')
        .setAuthor({
            name: 'Assassin Store',
            iconURL: 'https://i.postimg.cc/SQg6NBWr/download.gif'
        })
        .setTitle('🤖 Bot Development Status')
        .setDescription(`**
أهلاً بك ${user}

تم استلام طلبك بنجاح من قبل <@&${process.env.DEV_ROLE_ID}>

سيتم إنشاء البوت الخاص بك قريباً.

برجاء الانتظار حتى يتم الانتهاء من التطوير.

## حالة طلبك الآن
🟡 تحت التطوير
        **`)
        .setFooter({
            text: 'Assassin Store Development Team'
        })
        .setTimestamp();

    return interaction.reply({
        embeds: [embed]
    });
    }

 if (interaction.customId === 'done_form') {

    const userId =
        interaction.fields.getTextInputValue('user_id');

    const downloadLink =
        interaction.fields.getTextInputValue('download_link');

    let user;

    try {
        user = await client.users.fetch(userId);
    } catch {
        return interaction.reply({
            content: '❌ ID غير صحيح',
            flags: 64
        });
    }

    const embed = new EmbedBuilder()
        .setColor('#00ff66')
        .setAuthor({
            name: 'Assassin Store',
            iconURL: 'https://i.postimg.cc/SQg6NBWr/download.gif'
        })
        .setTitle('✅ Bot Development Completed')
        .setDescription(`**
أهلاً بك ${user}

تم الانتهاء من تطوير البوت الخاص بك بنجاح بواسطة <@&${process.env.DEV_ROLE_ID}>

📦 البوت أصبح جاهزاً للتسليم.

## حالة طلبك الآن
🟢 مكتمل
       ** `);

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel('📥 استلام البوت')
                .setStyle(ButtonStyle.Link)
                .setURL(downloadLink)
        );

    return interaction.reply({
        embeds: [embed],
        components: [row]
    });
 }

    if (interaction.customId === 'test_form') {

    const userId =
        interaction.fields.getTextInputValue('user_id');

    let user;

    try {
        user = await client.users.fetch(userId);
    } catch {
        return interaction.reply({
            content: '❌ ID غير صحيح',
            flags: 64
        });
    }

    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setAuthor({
            name: 'Assassin Store',
            iconURL: 'https://i.postimg.cc/SQg6NBWr/download.gif'
        })
        .setTitle('🧪 Bot Testing Status')
        .setDescription(`**
أهلاً بك ${user}

تم الانتهاء من تطوير البوت الخاص بك بواسطة <@&${process.env.DEV_ROLE_ID}>

ويجري الآن اختبار جميع الأنظمة والتأكد من عملها بشكل صحيح.

برجاء الانتظار حتى الانتهاء من مرحلة الاختبار.

## حالة طلبك الآن
🔵 تحت الاختبار
       ** `)
        .setFooter({
            text: 'Assassin Store Development Team'
        })
        .setTimestamp();

    return interaction.reply({
        embeds: [embed]
    });
    }

    if (interaction.customId === 'cancel_form') {

    const userId =
        interaction.fields.getTextInputValue('user_id');

    const reason =
        interaction.fields.getTextInputValue('reason');

    let user;

    try {
        user = await client.users.fetch(userId);
    } catch {
        return interaction.reply({
            content: '❌ ID غير صحيح',
            flags: 64
        });
    }

    const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setAuthor({
            name: 'Assassin Store',
            iconURL: 'https://i.postimg.cc/SQg6NBWr/download.gif'
        })
        .setTitle('❌ Order Cancelled')
        .setDescription(`**
أهلاً بك ${user}

نأسف لإبلاغك بأنه تم إلغاء الطلب الخاص بك.

## سبب الإلغاء
${reason}

## حالة طلبك الآن
🔴 ملغي
       ** `)
        .setFooter({
            text: 'Assassin Store Development Team'
        })
        .setTimestamp();

    return interaction.reply({
        embeds: [embed]
    });
    }
        
    let embed = new EmbedBuilder()
        .setColor('#242424')
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setFooter({
            text: `تم إنشاء الفاتورة بواسطة ${interaction.user.tag}`
        });

    if (interaction.customId === 'invoice_pubg') {

        embed.setTitle('PUBG Invoice')
            .addFields(
                { name: 'اسم العميل', value: interaction.fields.getTextInputValue('name') },
                { name: 'UC', value: interaction.fields.getTextInputValue('uc') },
                { name: 'ID ولا Account', value: interaction.fields.getTextInputValue('method') }
            );
    }

    if (interaction.customId === 'invoice_freefire') {

        embed.setTitle('Free Fire Invoice')
            .addFields(
                { name: 'اسم العميل', value: interaction.fields.getTextInputValue('name') },
                { name: 'الجواهر', value: interaction.fields.getTextInputValue('diamonds') },
                { name: 'ID ولا Account', value: interaction.fields.getTextInputValue('method') }
            );
    }

    if (interaction.customId === 'invoice_nitro') {

        embed.setTitle('Nitro Invoice')
            .addFields(
                { name: 'اسم العميل', value: interaction.fields.getTextInputValue('name') },
                { name: 'المدة', value: interaction.fields.getTextInputValue('duration') }
            );
    }

    if (interaction.customId === 'invoice_steam') {

        embed.setTitle('🎮 Steam Games Invoice')
            .addFields(
                { name: 'اسم العميل', value: interaction.fields.getTextInputValue('name') },
                { name: 'اسم اللعبة', value: interaction.fields.getTextInputValue('game') }
            );
    }

    if (interaction.customId === 'invoice_video') {

        embed.setTitle('🎬 Video Editing Invoice')
            .addFields(
                { name: 'اسم العميل', value: interaction.fields.getTextInputValue('name') },
                { name: 'نوع الفيديو', value: interaction.fields.getTextInputValue('video_type') },
                { name: 'مدة الفيديو', value: interaction.fields.getTextInputValue('duration') }
            );
    }

    if (interaction.customId === 'invoice_thumbnail') {

        embed.setTitle('🖼️ Thumbnail Invoice')
            .addFields(
                { name: 'اسم العميل', value: interaction.fields.getTextInputValue('name') },
                { name: 'عنوان الثمبنيل', value: interaction.fields.getTextInputValue('thumb_title') },
                { name: 'مقاس الصورة', value: interaction.fields.getTextInputValue('size') }
            );
    }

    if (interaction.customId === 'invoice_graphics') {

        embed.setTitle('💎 Elite Graphics Invoice')
            .addFields(
                { name: 'اسم العميل', value: interaction.fields.getTextInputValue('name') },
                { name: 'نوع التصميم', value: interaction.fields.getTextInputValue('design_type') },
                { name: 'تفاصيل الطلب', value: interaction.fields.getTextInputValue('details') }
            );
    }

    if (interaction.customId === 'invoice_bot') {

    embed.setTitle('🤖 Custom Bot Invoice')
        .addFields(
            {
                name: 'اسم العميل',
                value: interaction.fields.getTextInputValue('name')
            },
            {
                name: 'اسم البوت',
                value: interaction.fields.getTextInputValue('bot_name')
            },
            {
                name: 'وصف البوت',
                value: interaction.fields.getTextInputValue('bot_description')
            },
            {
                name: 'بوت مشابه',
                value: interaction.fields.getTextInputValue('similar_bot') || 'لا يوجد'
            }
        );
}

    if (interaction.customId === 'invoice_design') {

        embed.setTitle('⚡ Premium Designs Invoice')
            .addFields(
                { name: 'اسم العميل', value: interaction.fields.getTextInputValue('name') },
                { name: 'نوع التصميم', value: interaction.fields.getTextInputValue('design_type') },
                { name: 'تفاصيل الطلب', value: interaction.fields.getTextInputValue('details') }
            );
    }

    return interaction.reply({
        embeds: [embed]
    });
}
});

const allowedRoles = [
    process.env.PAY_ROLE_1,
    process.env.PAY_ROLE_2
];

client.on('messageCreate', async message => {


});

client.once('ready', async () => {

   const commands = [
    new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('ارسال بانل التذاكر'),

    new SlashCommandBuilder()
        .setName('order')
        .setDescription('انشاء طلب جديد'),

    new SlashCommandBuilder()
        .setName('pay')
        .setDescription('عرض طرق الدفع'),

    new SlashCommandBuilder()
        .setName('feedback')
        .setDescription('ارسال نظام التقييم'),

    new SlashCommandBuilder()
    .setName('wait')
    .setDescription('ارسال حالة تطوير البوت'),

    new SlashCommandBuilder()
    .setName('done')
    .setDescription('تم الانتهاء من البوت'),

    new SlashCommandBuilder()
    .setName('test')
    .setDescription('البوت تحت الاختبار'),

    new SlashCommandBuilder()
    .setName('cancel')
    .setDescription('الغاء الطلب'),

    new SlashCommandBuilder()
    .setName('signup')
    .setDescription('ارسال بانل التسجيل'),

    new SlashCommandBuilder()
    .setName('account')
    .setDescription('عرض بيانات الحساب')
    .addStringOption(option =>
        option
            .setName('discord_id')
            .setDescription('Discord ID')
            .setRequired(true)
    ),
];

    const rest = new REST({ version: '10' })
        .setToken(process.env.TOKEN);

    await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands }
    );

    console.log('Slash Commands Loaded');
});

client.login(process.env.TOKEN);
