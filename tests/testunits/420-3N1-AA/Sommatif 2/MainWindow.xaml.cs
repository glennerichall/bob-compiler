/* Résultat: 15/20 */
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Reflection;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media.Imaging;

namespace sommatif2
{
    /// <summary>
    /// Logique d'interaction pour MainWindow.xaml
    /// </summary>
    public partial class MainWindow
    {
        private SqliteDataBase _sqliteDataBase;
        private readonly string _path;
        private bool _reEntrant;
        private int _currentIndex;

        public List<string> NamesList { get; }

        public MainWindow()
        {
            InitializeComponent();
            _path = Path.GetDirectoryName(Assembly.GetEntryAssembly()?.Location);
            _sqliteDataBase = new SqliteDataBase(_path);
            DgEtudiant.DataContext = _sqliteDataBase.DataSet;
            _sqliteDataBase.Open(_path);
            UpdateDataSet();
            UpdateEnregistrement();
            ComboBoxName.Items.Clear();
            NamesList = _sqliteDataBase.Names;
            foreach (var name in NamesList)
            {
                ComboBoxName.Items.Add(name);
            }
            ComboBoxName.SelectedItem = NamesList[0];
            ComboBoxName.SelectionChanged += ComboBoxNameOnSelectionChanged;
        }
        private void UpdateDataSet()
        {
            (DgEtudiant.DataContext as DataSet)?.Clear();
            _sqliteDataBase.Fill(_sqliteDataBase.DataSet);
        }

        private void UpdateEnregistrement()
        {
            LabelTot.Content = _sqliteDataBase.TotalResult + " enregistrement(s)";
        }

        private void DgPatients_OnSelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var row = DgEtudiant.SelectedItem as DataRowView;
            if (row == null) return;
            var user = row.Row["name"];
            /* Err(10)  */
            imgEtudiant.Source = File.Exists(($"{_path}\\photos\\{user}.jpg")) ? new BitmapImage(new Uri($"{_path}\\photos\\{user}.jpg")) : new BitmapImage(new Uri($"{_path}\\photos\\Absent.jpg"));
        }

        private void DgEtudiant_OnCellEditEnding(object sender, DataGridCellEditEndingEventArgs e)
        {
            if (_reEntrant) return;
            _reEntrant = true;
            if (e.EditAction != DataGridEditAction.Cancel)
            {
                DgEtudiant.CommitEdit(DataGridEditingUnit.Row, false);
                _sqliteDataBase.Update();
            }
            _reEntrant = false;
        }

        private void ComboBoxNameOnSelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            _currentIndex = DgEtudiant.SelectedIndex;
            (DgEtudiant.DataContext as DataSet)?.Clear();
            var name = (sender as ComboBox)?.SelectedItem as string;
            _sqliteDataBase.SortOnName(name);
            _sqliteDataBase.Fill(_sqliteDataBase.DataSet);
            UpdateEnregistrement();
            // Err(11) 
            DgEtudiant.SelectedIndex = _currentIndex;
        }
    }
}
