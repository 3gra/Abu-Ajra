const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config.json');
const CharactersCreated = require('../../models/Characters-Created');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // التأكد من أن التفاعل من المودال وأن معرفه يبدأ بـ "characterModal_"
    if (!interaction.isModalSubmit() || !interaction.customId.startsWith('characterModal_')) return;

    // استخراج رقم الشخصية من customId (مثلاً character_1)
    const characterOption = interaction.customId.split('_')[1];

    // جلب القيم
    const firstName = interaction.fields.getTextInputValue('firstName');
    const lastName = interaction.fields.getTextInputValue('lastName');
    const gender = interaction.fields.getTextInputValue('gender');
    const birthday = interaction.fields.getTextInputValue('birthday');
    const placeBirth = interaction.fields.getTextInputValue('placeBirth');

    // التحقق من صحة المدخلات
    const errors = [];

    // First & Last Name إنجليزية فقط
    if (!/^[A-Za-z]+$/.test(firstName)) {
      errors.push('First Name must contain English letters only.');
    }
    if (!/^[A-Za-z]+$/.test(lastName)) {
      errors.push('Last Name must contain English letters only.');
    }

    // Gender فقط (Male, MALE, Female, FEMALE)
    if (!/^(Male|MALE|Female|FEMALE)$/.test(gender)) {
      errors.push("Gender must be 'Male' or 'Female' only.");
    }

    // تاريخ الميلاد بصيغة YYYY/MM/DD
    if (!/^\d{4}\/\d{2}\/\d{2}$/.test(birthday)) {
      errors.push('Birthday must follow the format YYYY/MM/DD.');
    }

    // مكان الولادة فقط (Los Santos, Polito, Sandy Shores)
    if (!/^(Los Santos|Polito|Sandy Shores)$/.test(placeBirth)) {
      errors.push('Place Birth must be one of: Los Santos, Polito, Sandy Shores.');
    }

    // لو فيه أخطاء، نرسلها للمستخدم بشكل مخفي
    if (errors.length > 0) {
      return interaction.reply({ content: errors.join('\n'), ephemeral: true });
    }

    // إنشاء أمبيد للعرض في القناة المحددة
    const embed = new EmbedBuilder()
      .setTitle('New Character Submission')
      .setDescription(`Submission for **${characterOption.replace('character_', 'Character ')}**`)
      .addFields(
        { name: 'First Name', value: firstName },
        { name: 'Last Name', value: lastName },
        { name: 'Gender', value: gender },
        { name: 'Birthday', value: birthday },
        { name: 'Place Birth', value: placeBirth },
        { name: 'Submitted By', value: `<@${interaction.user.id}>` }
      )
      .setColor('Green')
      .setTimestamp();

    // زر القبول
    const acceptButton = new ButtonBuilder()
      .setCustomId(`accept_${interaction.user.id}_${characterOption}`)
      .setLabel('Accept')
      .setStyle(ButtonStyle.Success);

    // زر الرفض
    const rejectButton = new ButtonBuilder()
      .setCustomId(`reject_${interaction.user.id}_${characterOption}`)
      .setLabel('Reject')
      .setStyle(ButtonStyle.Danger);

    const buttonsRow = new ActionRowBuilder().addComponents(acceptButton, rejectButton);

    // إرسال الأمبيد إلى الشات المحدد في config
    const submissionChannel = await client.channels.fetch(config.submitChannelId);
    if (!submissionChannel) {
      // لو القناة غير موجودة
      return interaction.reply({ content: 'Submission channel not found!', ephemeral: true });
    }

    await submissionChannel.send({ embeds: [embed], components: [buttonsRow] });
    await interaction.reply({ content: 'Your submission has been sent for review.', ephemeral: true });
  }
};
