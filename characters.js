const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'characters',
  description: 'أمر إنشاء شخصية جديدة من ثلاث خيارات',

  async execute(message, args, client) {
    // حذف رسالة الأمر
    await message.delete().catch(console.error);

    // إعداد الأمبيد
    const embed = new EmbedBuilder()
      .setTitle('Character Creation')
      .setDescription('Please select one of the following character creation options:')
      .setColor('Blue');

    // إعداد قائمة الاختيارات (Select Menu)
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('character_select') // معرف التفاعل
      .setPlaceholder('Select a character to create')
      .addOptions([
        {
          label: 'Create Character 1',
          description: 'Submit details for Character 1',
          value: 'character_1'
        },
        {
          label: 'Create Character 2',
          description: 'Submit details for Character 2',
          value: 'character_2'
        },
        {
          label: 'Create Character 3',
          description: 'Submit details for Character 3',
          value: 'character_3'
        }
      ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    // إرسال الرسالة مع الأمبيد والقائمة
    await message.channel.send({ embeds: [embed], components: [row] });
  }
};
