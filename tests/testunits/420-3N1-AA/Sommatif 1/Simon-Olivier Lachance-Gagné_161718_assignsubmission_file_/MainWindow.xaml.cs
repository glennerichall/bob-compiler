/* Résultat: 17/20 */
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

namespace Sommatif_1
{
    /// <summary>
    /// Logique d'interaction pour MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();


            Couleur.SelectedColor = Color.FromRgb(0, 0, 0);

            var fonts = new InstalledFontCollection();

            foreach (var family in fonts.Families)
            {
                lbxfamily.Items.Add(
                    new ListBoxItem
                    {
                        Content = family.Name,
                        FontFamily = new FontFamily(family.Name)
                    }
                );
            }

        }

        private void ListBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var famille = (String)((ListBoxItem)lbxfamily.SelectedItem).Content;
            familyInput.Text = famille;

            Apercus.Text = famille;
            Apercus.FontFamily = ((ListBoxItem)lbxfamily.SelectedItem).FontFamily;

        }

        private void LbxTaille_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var taille = (String)((ListBoxItem)lbxTaille.SelectedItem).Content;
            tailleBox.Text = taille;

            if (Apercus == null)
                return;

            Apercus.FontSize = Int32.Parse((String)((ListBoxItem)lbxTaille.SelectedItem).Content);
        }

        private void LbxStyle_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var style = (String)((ListBoxItem)lbxStyle.SelectedItem).Content;
            styleBox.Text = style;

            if (Apercus != null)
            {
                if (lbxStyle.SelectedIndex == 0)
                {
                    Apercus.FontStyle = FontStyles.Normal;
                    Apercus.FontWeight = FontWeights.Normal;
                }
                /* Err:(15) Instruction inadéquate, (0.5 point) */
                if (lbxStyle.SelectedIndex == 1)
                {
                    Apercus.FontStyle = FontStyles.Italic;
                    Apercus.FontWeight = FontWeights.Normal;
                }
                if (lbxStyle.SelectedIndex == 2)
                {
                    Apercus.FontStyle = FontStyles.Normal;
                    Apercus.FontWeight = FontWeights.Bold;
                }
                if (lbxStyle.SelectedIndex == 3)
                {
                    Apercus.FontStyle = FontStyles.Italic;
                    Apercus.FontWeight = FontWeights.Bold;
                }
            }
        }

        private void Soulignement_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (Apercus != null)
            {

                TextDecorationCollection CollectionUnderline0 = new TextDecorationCollection();
                TextDecorationCollection CollectionUnderline1 = new TextDecorationCollection();

                TextDecoration BigUnderline = new TextDecoration();
                Pen BigUnderlinePen = new Pen();
                BigUnderlinePen.Brush = new SolidColorBrush(Color.FromRgb(0, 0, 0));
                BigUnderlinePen.Thickness = 5;
                BigUnderline.Pen = BigUnderlinePen;
                CollectionUnderline0.Add(BigUnderline);

                TextDecoration TiretUnderline = new TextDecoration();
                Pen TiretUnderlinePen = new Pen();
                TiretUnderlinePen.Brush = new SolidColorBrush(Color.FromRgb(0, 0, 0));
                TiretUnderlinePen.Thickness = 1;
                TiretUnderlinePen.DashStyle = DashStyles.Dash;

                TiretUnderline.Pen = TiretUnderlinePen;
                TiretUnderline.PenThicknessUnit = TextDecorationUnit.FontRecommended;
                CollectionUnderline1.Add(TiretUnderline);

                if (Soulignement.SelectedIndex == 0)
                {
                    Apercus.TextDecorations = null;
                }
                if (Soulignement.SelectedIndex == 1)
                {
                    Apercus.TextDecorations = TextDecorations.Underline;
                }
                if (Soulignement.SelectedIndex == 2)
                {
                    Apercus.TextDecorations = CollectionUnderline0;
                }
                if (Soulignement.SelectedIndex == 3)
                {
                    Apercus.TextDecorations = CollectionUnderline1;
                }
            }
        }

        private void Couleur_SelectedColorChanged(object sender, RoutedPropertyChangedEventArgs<Color?> e)
        {
            var Rc = Couleur.SelectedColor.Value.R;
            var Gc = Couleur.SelectedColor.Value.G;
            var Bc = Couleur.SelectedColor.Value.B;

            var ColoredBrush = new SolidColorBrush(Color.FromRgb(Rc, Gc, Bc));

            Apercus.Foreground = ColoredBrush;
        }

    }
}
