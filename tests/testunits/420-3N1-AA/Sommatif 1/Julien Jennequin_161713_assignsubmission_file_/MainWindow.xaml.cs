/* Résultat: 13.5/20 */
﻿/* Bien.
 *
 * Code bien indenté,
 * Opérations fonctionnelles.
 *
 * Attention!
 *
 * Using inutiles,
 * Manque de commentaires.
 */

using System;
using System.Collections.Generic;
using System.Drawing.Text;
using System.Linq;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace Sommatif_2
{
    /// <summary>
    /// Logique d'interaction pour MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            var fonts = new InstalledFontCollection();

            foreach (var family in fonts.Families)
            {
                LstPlcFamily.Items.Add(
                new ListBoxItem()
                {
                    Content = family.Name,
                    FontFamily = new FontFamily(family.Name)
                });
            }

        }

        private void LstPoliceFamilyChange(object sender, SelectionChangedEventArgs e)
        {
            var family = (ListBoxItem)LstPlcFamily.SelectedItem;
            txtBlockApercu.Text = (String)family.Content;

            txtBlockApercu.FontFamily = new FontFamily((string)family.Content);

        }

        private void LstColorChange(object sender, RoutedPropertyChangedEventArgs<Color?> e)
        {
            var color = LstColor.SelectedColor.Value;
            // Err: (9) Variables inutilisées, (1 point) 
            var red = color.R;
            var green = color.G;
            var blue = color.B;

            var foreground = new SolidColorBrush(Color.FromArgb(color.A, color.R, color.G, color.B));

            txtBlockApercu.Foreground = foreground;

        }

        private void LstStyleChange(object sender, SelectionChangedEventArgs e)
        {
            var style = LstStyle.SelectedIndex;

            switch (style)
            {
                case 0:
                    txtBlockApercu.FontStyle = FontStyles.Normal;
                    txtBlockApercu.FontWeight = FontWeights.Normal;

                    break;

                case 1:
                    txtBlockApercu.FontWeight = FontWeights.Normal;
                    txtBlockApercu.FontStyle = FontStyles.Italic;
                    break;

                case 2:
                    txtBlockApercu.FontStyle = FontStyles.Normal;
                    txtBlockApercu.FontWeight = FontWeights.Bold;

                    break;

                case 3:
                    txtBlockApercu.FontStyle = FontStyles.Italic;
                    txtBlockApercu.FontWeight = FontWeights.Bold;
                    break;

                default:
                    txtBlockApercu.FontStyle = FontStyles.Normal;
                    txtBlockApercu.FontWeight = FontWeights.Normal;
                    break;

            }

        }

        private void LstSizeChange(object sender, SelectionChangedEventArgs e)
        {
            var tailleTarget = int.Parse(lblSize.Content.ToString());
            txtBlockApercu.FontSize = tailleTarget;
        }

        private void LstSoulignementChange(object sender, SelectionChangedEventArgs e)
        {
            var index = LstSoulignement.SelectedIndex;

            switch (index)
            {
                case 0:
                    txtBlockApercu.TextDecorations = null;
                    break;
                case 1:
                    txtBlockApercu.TextDecorations = TextDecorations.Baseline;
                    break;

                case 2:
                    TextDecoration souligne = new TextDecoration();
                    TextDecorationCollection defaultTxt = new TextDecorationCollection();
                    Pen pen = new Pen();

                    pen.Thickness = 5;
                    pen.Brush = new SolidColorBrush(Colors.Black);

                    souligne.Pen = pen;
                    souligne.PenThicknessUnit = TextDecorationUnit.FontRecommended;

                    defaultTxt.Add(souligne);
                    txtBlockApercu.TextDecorations = defaultTxt;
                    break;

                case 3:
                    TextDecoration souligneBarre = new TextDecoration();
                    TextDecorationCollection defaultTxt1 = new TextDecorationCollection();
                    Pen pen1 = new Pen();

                    pen1.DashStyle = DashStyles.Dash;
                    pen1.Brush = new SolidColorBrush(Colors.Black);

                    souligneBarre.Pen = pen1;

                    defaultTxt1.Add(souligneBarre);
                    txtBlockApercu.TextDecorations = defaultTxt1;
                    break;

                default:

                    break;

            }
        }
    }
}