const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    InteractionType,
    ChannelType,
} = require('discord.js');

require('dotenv').config();

const discordTranscripts = require('discord-html-transcripts');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('clientReady', async () => {

    console.log(`${client.user.tag} جاهز`);

    const panelChannel = client.channels.cache.get(process.env.PANEL_CHANNEL_ID);

    const embed = new EmbedBuilder()
        .setColor('#242424')
        .setTitle(' Assassin Store Center 🛒')
        .setDescription(`
# Server Tickets 🎫
## Gamming Hub 🎮
### PUBG 🎮 
** لشراء شدات ببجي اضغط هنا **
### Free Fire 🔥 
** لشراء جواهر فري فاير اضفط هنا **
### Steam Games 🎮 
** لشراء العاب ستيم اضغط هنا **
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
            text: 'Assassin Store Ticket System'
        });

    const menu = new StringSelectMenuBuilder()
        .setCustomId('ticket_menu')
        .setPlaceholder('اختر الخدمة')
        .addOptions([
           {
    label: 'PUBG',
    value: 'pubg',
    description: 'شراء شدات ببجي',
    emoji: '🎮'
},
{
    label: 'Free Fire',
    value: 'freefire',
    description: 'شراء جواهر فري فاير',
    emoji: '🔥'
},
{
    label: 'Steam Games',
    value: 'steam_games',
    description: 'شراء ألعاب ستيم',
    emoji: '🎮'
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

    const row = new ActionRowBuilder().addComponents(menu);

    await panelChannel.send({
        embeds: [embed],
        components: [row]
    });

});

client.on('interactionCreate', async interaction => {

    // ================= SELECT MENU =================
    if (interaction.isStringSelectMenu()) {

        if (interaction.customId === 'ticket_menu') {
          
            await interaction.deferReply({ flags: 64 });

            const value = interaction.values[0];

            let product = '';
            let paymentMethods = '';

            if (value === 'pubg') {
                product = '** PUBG **';
                paymentMethods = `
**  طرق الدفع: 💳 **
### • Vodafone Cash
### • e& Cash
### • We Pay
### • Insta Pay
### • Fawry
                `;
            }

            if (value === 'freefire') {
                product = '** Free Fire** ';
                paymentMethods = `
**  طرق الدفع: 💳 **
### • Vodafone Cash
### • e& Cash
### • We Pay
### • Insta Pay
### • Fawry
                `;
            }

            if (value === 'nitro') {
                product = '** Discord Nitro **';
                paymentMethods = `
**  طرق الدفع: 💳 **
### • Vodafone Cash
### • e& Cash
### • We Pay
### • Insta Pay
### • Fawry
                `;
            }
if (value === 'video_editing') {
    product = '** Video Editing **';
    paymentMethods = `
** طرق الدفع: 💳 **
### • Vodafone Cash
### • Insta Pay
### • We Pay
    `;
}

if (value === 'thumbnail_orders') {
    product = '** Thumbnail Orders **';
    paymentMethods = `
** طرق الدفع: 💳 **
### • Vodafone Cash
### • Insta Pay
### • We Pay
    `;
}

if (value === 'premium_designs') {
    product = '** Premium Designs **';
    paymentMethods = `
** طرق الدفع: 💳 **
### • Vodafone Cash
### • Insta Pay
### • We Pay
    `;
}

if (value === 'elite_graphics') {
    product = '** Elite Graphics **';
    paymentMethods = `
** طرق الدفع: 💳 **
### • Vodafone Cash
### • Insta Pay
### • We Pay
    `;
}

if (value === 'steam_games') {
    product = '** Steam Games **';
    paymentMethods = `
** طرق الدفع: 💳 **
### • Vodafone Cash
### • Insta Pay
### • We Pay
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

        // create invoice (زي ما هو)
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
    !type.includes('design')
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

    if (message.author.bot) return;

    if (message.content === '!pay') {


        if (!message.member.roles.cache.some(role => allowedRoles.includes(role.id))) {
            return message.reply({
                content: '❌ ليس لديك صلاحية لاستخدام هذا الأمر.'
            });
        }

        const payEmbed = new EmbedBuilder()
            .setColor('#242424')
            .setAuthor({
                name: `${message.author.username}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setTitle(' Payment Methods💳')
            .setDescription(`
 **VF Cash 💵 
01023019916  

 Etisalat Cash 💵 
01101881816  

 We Pay 💵 
01101891816  

 Insta Pay 💳 
assassin0@instapay  
assassin20@instapay  

**جميع طرق الدفع متاحة**  
شكرا لتعاملك معنا ❤️
            `)
            .setFooter({
                text: 'Assassin Store Payment System'
            });

        return message.channel.send({
            embeds: [payEmbed]
        });
    }
    if (message.content === '!fed') {

    if (!message.member.roles.cache.some(role =>
        allowedRoles.includes(role.id)
    )) {
        return message.reply({
            content: '❌ ليس لديك صلاحية لاستخدام هذا الأمر.'
        });
    }

    const embed = new EmbedBuilder()
        .setColor('#242424')
        .setTitle('Feedback System ⭐')
        .setDescription('### نشكرك على وقتك وثقتك بنا ونرجو منك تقييم تجربتك معنا من خلال الأزرار الموجودة بالأسفل آراؤكم محل اهتمام كبير لدينا حيث تساعدنا بشكل مباشر على تحسین جودة الخدمة وتطوير الأدا بشكل مستمر لتقديم تجربة أفضل للجميع لا تتردد في اختيار التقييم الذي يعكس تجربتك بكل شفافيه')
        .setThumbnail('https://i.postimg.cc/SQg6NBWr/download.gif');

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('rate_1').setLabel('★').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('rate_2').setLabel('★★').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('rate_3').setLabel('★★★').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('rate_4').setLabel('★★★★').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('rate_5').setLabel('★★★★★').setStyle(ButtonStyle.Secondary)
    );

    message.channel.send({
        embeds: [embed],
        components: [row]
    });
}
});

client.login(process.env.TOKEN);
