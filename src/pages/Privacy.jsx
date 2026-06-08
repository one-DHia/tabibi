
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Privacy = () => {
    const { language } = useLanguage();

    return (
        <div className="pt-24 pb-16 min-h-screen container mx-auto px-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">
                {language === 'ar' ? 'سياسة الخصوصية' : 'Politique de Confidentialité'}
            </h1>

            <div className="prose prose-emerald max-w-none bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-600 mb-6">
                    {language === 'ar'
                        ? 'آخر تحديث: 20 جانفي 2026'
                        : 'Dernière mise à jour : 20 Janvier 2026'}
                </p>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">
                        {language === 'ar' ? '1. جمع البيانات' : '1. Collecte des Données'}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        {language === 'ar'
                            ? 'نحن نجمع المعلومات التي تقدمها لنا طوعًا عند استخدام المنصة، مثل الاسم، رقم الهاتف، والبريد الإلكتروني عند التسجيل أو حجز موعد.'
                            : 'Nous collectons les informations que vous nous fournissez volontairement lors de l\'utilisation de la plateforme, telles que votre nom, numéro de téléphone et adresse e-mail lors de l\'inscription ou de la prise de rendez-vous.'}
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">
                        {language === 'ar' ? '2. استخدام البيانات' : '2. Utilisation des Données'}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        {language === 'ar'
                            ? 'تستخدم بياناتك حصريًا لتسهيل عملية حجز المواعيد الطبية، وتحسين تجربتك على المنصة، والتواصل معك بخصوص مواعيدك.'
                            : 'Vos données sont utilisées exclusivement pour faciliter la prise de rendez-vous médicaux, améliorer votre expérience sur la plateforme et communiquer avec vous concernant vos rendez-vous.'}
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">
                        {language === 'ar' ? '3. حماية البيانات' : '3. Protection des Données'}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        {language === 'ar'
                            ? 'نحن نطبق إجراءات أمنية صارمة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الإفشاء أو الإتلاف.'
                            : 'Nous mettons en œuvre des mesures de sécurité strictes pour protéger vos informations personnelles contre l\'accès non autorisé, la modification, la divulgation ou la destruction.'}
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-4 text-gray-800">
                        {language === 'ar' ? '4. اتصل بنا' : '4. Nous Contacter'}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        {language === 'ar'
                            ? 'لأي استفسار بخصوص خصوصيتك، يرجى التواصل معنا عبر: privacy@tabibi.dz'
                            : 'Pour toute question concernant votre confidentialité, veuillez nous contacter à : privacy@tabibi.dz'}
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Privacy;
