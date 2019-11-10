/* Résultat: 16.5/20 */
﻿using System;
using System.Collections.Generic;
using System.Drawing.Text;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace sommatif1
{
    /// <summary>
    /// Logique d'interaction pour MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            MonTxt.Text = "Arial";
            var fonts = new InstalledFontCollection();
            lsbTaille.ScrollIntoView(2);
            ClrPcker_Background.SelectedColor = Color.FromRgb(0, 0, 0);
            foreach (var family in fonts.Families)
            {
                lsbFont.Items.Add(
                    new ListBoxItem
                    {
                        Content = family.Name,
                        FontFamily = new FontFamily(family.Name)
                    }
                );
            }
        }

        void ShowFont(object sender, SelectionChangedEventArgs args)
        {
            var lbi = ((sender as ListBox).SelectedItem as ListBoxItem);
            txtFont.Text = lbi.Content.ToString();
            MonTxt.Text = lbi.Content.ToString();
            MonTxt.FontFamily = lbi.FontFamily;
        }

        void ShowStyle(object sender, SelectionChangedEventArgs args)
        {
            var lbi = ((sender as ListBox).SelectedItem as ListBoxItem);
            var lbiContent = lbi.Content.ToString();
            styleFont.Text = lbiContent;
            switch (lbiContent)
            {
                case "Gras Italique":
                    MonTxt.FontWeight = FontWeights.Bold;
                    MonTxt.FontStyle = FontStyles.Italic;
                    break;
                case "Gras":
                    MonTxt.FontStyle = FontStyles.Normal;
                    MonTxt.FontWeight = FontWeights.Bold;
                    break;
                case "Italique":
                    MonTxt.FontWeight = FontWeights.Normal;
                    MonTxt.FontStyle = FontStyles.Italic;
                    break;
                default:
                    MonTxt.FontStyle = FontStyles.Normal;
                    MonTxt.FontWeight = FontWeights.Normal;
                    break;
            }
        }
        void ShowTaille(object sender, SelectionChangedEventArgs args)
        {
            var lbi = ((sender as ListBox).SelectedItem as ListBoxItem);
            tailleFont.Text = lbi.Content.ToString();
            var maTaille = int.Parse(lbi.Content.ToString());
            MonTxt.FontSize = maTaille;
        }

        private void ClrPcker_SelectedColorChanged(object sender, RoutedPropertyChangedEventArgs<Color?> routedPropertyChangedEventArgs)
        {
            MonTxt.Foreground = (SolidColorBrush)new BrushConverter().ConvertFromString(ClrPcker_Background.SelectedColor.ToString());
        }

        private void ComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (MonTxt == null)
            {
                return;
            }

            var cbB = ((sender as ComboBox));
            if (cbB != null)
            {
                /* Err: (15) Instruction inadéquate, (0.5 point) */
                if (cbB.SelectedIndex != 0)
                {
                    MonTxt.TextDecorations = ((TextBlock)((ComboBoxItem)cbBSoulignement.SelectedItem).Content).TextDecorations;
                }
                else if (cbB.SelectedIndex == 0)
                {
                    MonTxt.TextDecorations = ((TextBlock)((ComboBoxItem)cbBSoulignement.SelectedItem).Content).TextDecorations;
                }
            }

        }
    }
}
