
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Terms = () => {
    const { language } = useLanguage();

    return (
        <div className="pt-24 pb-16 min-h-screen container mx-auto px-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">
                {language === 'ar' ? 'شروط الاستخدام' : 'Conditions Générales d\'Utilisation'}
            </h1>

            <div className="prose prose-emerald max-w-none bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-600 mb-6">
                    {language === 'ar'
                        ? 'آخر تحديث: 20 جانفي 2026'
                        : 'Dernière mise à jour : 20 Janvier 2026'}
                </p>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">
                        {language === 'ar' ? '1. القبول' : '1. Acceptation'}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        {language === 'ar'
                            ? 'من خلال الوصول إلى منصة Tabibi واستخدامها، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق، يرجى عدم استخدام خدماتنا.'
                            : 'En accédant et en utilisant la plateforme Tabibi, vous acceptez d\'être lié par ces termes et conditions. Si vous n\'acceptez pas, veuillez ne pas utiliser nos services.'}
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">
                        {language === 'ar' ? '2. الخدمات' : '2. Services'}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        {language === 'ar'
                            ? 'Tabibi هي منصة وسيطة تربط المرضى بمهنيي الصحة. نحن لا نقدم المشورة الطبية ولا نتحمل مسؤولية الممارسات الطبية للمهنيين المدرجين.'
                            : 'Tabibi est une plateforme intermédiaire reliant les patients aux professionnels de santé. Nous ne fournissons pas de conseils médicaux et ne sommes pas responsables des pratiques médicales des professionnels listés.'}
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">
                        {language === 'ar' ? '3. الحسابات' : '3. Comptes'}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        {language === 'ar'
                            ? 'أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور الخاصة بك. أي نشاط يتم تحت حسابك هو مسؤوليتك.'
                            : 'Vous êtes responsable du maintien de la confidentialité de votre compte et de votre mot de passe. Toute activité effectuée sous votre compte est votre responsabilité.'}
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-4 text-gray-800">
                        {language === 'ar' ? '4. القانون المعمول به' : '4. Loi Applicable'}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        {language === 'ar'
                            ? 'تخضع هذه الشروط لقوانين الجمهورية الجزائرية الديمقراطية الشعبية.'
                            : 'Ces conditions sont régies par les lois de la République Algérienne Démocratique et Populaire.'}
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Terms;
