#!/bin/bash

# Defina o diretório de origem onde estão localizadas as pastas de migração
SOURCE_DIR="./"

# Defina o diretório de destino onde os arquivos .sql serão copiados
DEST_DIR="./dest"

# Cria o diretório de destino se ele não existir
mkdir -p "$DEST_DIR"

# Encontra todos os arquivos .sql dentro do diretório de origem e suas subpastas
find "$SOURCE_DIR" -type f -name "*.sql" | while read file; do
    # Extrai o nome da pasta pai do arquivo encontrado
    parent_dir=$(basename "$(dirname "$file")")
    
    # Extrai o nome base do arquivo encontrado
    filename=$(basename "$file")
    
    # Compõe o novo nome do arquivo com o prefixo da pasta pai
    new_filename="${parent_dir}_${filename}"
    
    # Copia o arquivo para o diretório de destino com o novo nome
    cp "$file" "$DEST_DIR/$new_filename"
done

echo "Todos os arquivos .sql foram copiados para $DEST_DIR com prefixos únicos."
