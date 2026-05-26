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
        .setColor('#00f7ff')
        .setTitle(' Assassin Store Center 🛒')
        .setDescription(`
### Open A Ticket

### PUBG 🎮 
** لشراء شدات ببجي اضغط هنا **
### Free Fire 🔥 
** لشراء جواهر فري فاير اضفط هنا **
### Nitro  💎
** لشراء النايترو اضغط هنا **

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
                description: 'شراء شدات ببحي',
                emoji: '🎮'
            },
            {
                label: 'Free Fire',
                value: 'freefire',
                description: 'شراء جواهر فري فاير',
                emoji: '🔥'
            },
            {
                label: 'Nitro',
                value: 'nitro',
                description: 'Discord Nitro شراء',
                emoji: '💎'
            }
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

            let prefix = '';
            if (value === 'pubg') prefix = 'pubg';
            if (value === 'freefire') prefix = 'freefire';
            if (value === 'nitro') prefix = 'nitro';

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
                .setColor('#00f7ff')
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

            setTimeout(() => interaction.channel.delete(), 5000);
        }

        // create invoice (زي ما هو)
        if (interaction.customId === 'create_invoice') {

const type = interaction.channel.name.toLowerCase();

if (
    !type.includes('pubg') &&
    !type.includes('freefire') &&
    !type.includes('nitro')
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

                const name = new TextInputBuilder().setCustomId('name').setLabel('اسم العميل').setStyle(TextInputStyle.Short);
                const uc = new TextInputBuilder().setCustomId('uc').setLabel('كمية الـ UC').setStyle(TextInputStyle.Short);
                const method = new TextInputBuilder().setCustomId('method').setLabel('ID ولا Account').setStyle(TextInputStyle.Short);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(name),
                    new ActionRowBuilder().addComponents(uc),
                    new ActionRowBuilder().addComponents(method)
                );
            }

            if (type.includes('freefire')) {
                modal.setCustomId('invoice_freefire');
                modal.setTitle('Free Fire Invoice');

                const name = new TextInputBuilder().setCustomId('name').setLabel('اسم العميل').setStyle(TextInputStyle.Short);
                const diamonds = new TextInputBuilder().setCustomId('diamonds').setLabel('كمية الجواهر').setStyle(TextInputStyle.Short);
                const method = new TextInputBuilder().setCustomId('method').setLabel('ID ولا Account').setStyle(TextInputStyle.Short);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(name),
                    new ActionRowBuilder().addComponents(diamonds),
                    new ActionRowBuilder().addComponents(method)
                );
            }

            if (type.includes('nitro')) {
                modal.setCustomId('invoice_nitro');
                modal.setTitle('Nitro Invoice');

                const name = new TextInputBuilder().setCustomId('name').setLabel('اسم العميل').setStyle(TextInputStyle.Short);
                const duration = new TextInputBuilder().setCustomId('duration').setLabel('Month / 3 Month / Year').setStyle(TextInputStyle.Short);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(name),
                    new ActionRowBuilder().addComponents(duration)
                );
            }

            return interaction.showModal(modal);
        }
    }

    // ================= MODAL =================
    if (interaction.type === InteractionType.ModalSubmit) {

        let embed = new EmbedBuilder().setColor('#00f7ff');

        if (interaction.customId === 'invoice_pubg') {

    embed.setTitle('PUBG Invoice')
        .setAuthor({
            name: `تم إنشاء الفاتورة بواسطة ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        })
        .addFields(
            { name: 'اسم العميل', value: interaction.fields.getTextInputValue('name') },
            { name: 'UC', value: interaction.fields.getTextInputValue('uc') },
            { name: 'ID ولا Account', value: interaction.fields.getTextInputValue('method') },
        );
}

       if (interaction.customId === 'invoice_freefire') {

    embed.setTitle('Free Fire Invoice')
        .setAuthor({
            name: `تم إنشاء الفاتورة بواسطة ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        })
        .addFields(
            { name: 'اسم العميل', value: interaction.fields.getTextInputValue('name') },
            { name: 'الجواهر', value: interaction.fields.getTextInputValue('diamonds') },
            { name: 'ID ولا Account', value: interaction.fields.getTextInputValue('method') },
        );
}

       if (interaction.customId === 'invoice_nitro') {

    embed.setTitle('Nitro Invoice')
        .setAuthor({
            name: `تم إنشاء الفاتورة بواسطة ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        })
        .addFields(
            { name: 'اسم العميل', value: interaction.fields.getTextInputValue('name') },
            { name: 'المدة', value: interaction.fields.getTextInputValue('duration') },
        );
}

        return interaction.reply({ embeds: [embed] });
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
            .setColor('#00f7ff')
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

});

client.login(process.env.TOKEN);