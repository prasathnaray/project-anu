# import os
# import sys
# import time
# import json
# import slicer

# # FIXED: Changed from D: drive to C: drive
# log_file = r"C:\Users\igrs\project-anu\Vol-conversion\conversion_logs\conversion_kretz_log.txt"

# def log_message(message):
#     timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
#     full_message = f"[{timestamp}] {message}"
#     print(full_message)
#     sys.stdout.flush()
    
#     try:
#         # Ensure log directory exists
#         os.makedirs(os.path.dirname(log_file), exist_ok=True)
#         with open(log_file, "a", encoding="utf-8") as f:
#             f.write(full_message + "\n")
#             f.flush()
#     except Exception as e:
#         print(f"Warning: Could not write to log file: {e}")

# def main():
#     log_message("=== Kretz VOL to NIFTI Conversion ===")
    
#     # Get arguments from Node.js
#     if len(sys.argv) < 4:
#         log_message("ERROR: Missing arguments. Expected: volumeId, inputPath, volumeName")
#         return False
    
#     volume_id = sys.argv[1]
#     input_path = sys.argv[2]
#     volume_name = sys.argv[3]
    
#     log_message(f"Volume ID: {volume_id}")
#     log_message(f"Input file: {input_path}")
#     log_message(f"Volume name: {volume_name}")
    
#     # Output folder - store in conversion_logs directory
#     output_folder = r"C:\Users\igrs\project-anu\Vol-conversion\nifti_output"
    
#     # Check if Kretz file reader is available
#     try:
#         module_names = [name for name in dir(slicer.modules) if not name.startswith('_')]
#         kretz_modules = [name for name in module_names if 'kretz' in name.lower()]
        
#         log_message(f"Available Kretz-related modules: {kretz_modules}")
        
#         if kretz_modules:
#             log_message("✅ Kretz file reader modules found")
#         else:
#             log_message("⚠️ No Kretz file reader modules found, will try generic loading")
            
#     except Exception as e:
#         log_message(f"Error checking modules: {e}")
    
#     # Check input file
#     if not os.path.exists(input_path):
#         log_message(f"❌ Input file does not exist: {input_path}")
#         return False
    
#     file_size = os.path.getsize(input_path)
#     log_message(f"Input file size: {file_size} bytes")
    
#     # Create output folder
#     if not os.path.exists(output_folder):
#         os.makedirs(output_folder)
#         log_message("✅ Created output folder")
    
#     # Generate output filename
#     base_name = os.path.splitext(os.path.basename(input_path))[0]
#     output_filename = f"{volume_id}_{base_name}.nii"
#     output_path = os.path.join(output_folder, output_filename)
    
#     log_message(f"Output will be: {output_path}")
    
#     try:
#         # Try loading with Kretz-specific properties first
#         log_message("Attempting to load Kretz VOL file...")
        
#         properties = {
#             'fileName': input_path,
#             'name': volume_name,
#             'scanConvert': True,
#             'outputSpacing': 0.5
#         }
        
#         volumeNode = None
        
#         # Try Kretz-specific loader
#         try:
#             volumeNode = slicer.util.loadNodeFromFile(input_path, "KretzFile", properties)
#         except Exception as e:
#             log_message(f"Kretz loader not available: {e}")
        
#         # Fallback to generic volume loader
#         if volumeNode is None:
#             log_message("Trying generic volume loader...")
#             volumeNode = slicer.util.loadVolume(input_path)
        
#         if volumeNode is None:
#             log_message("❌ All loading methods failed")
#             print(json.dumps({
#                 "success": False,
#                 "error": "Failed to load volume file"
#             }))
#             return False
        
#         log_message(f"✅ Successfully loaded: {volumeNode.GetName()}")
#         log_message(f"Node class: {volumeNode.GetClassName()}")
        
#         # Check image data
#         if not volumeNode.GetImageData():
#             log_message("❌ No image data in loaded volume")
#             slicer.mrmlScene.RemoveNode(volumeNode)
#             print(json.dumps({
#                 "success": False,
#                 "error": "No image data in volume"
#             }))
#             return False
        
#         dimensions = volumeNode.GetImageData().GetDimensions()
#         log_message(f"Image dimensions: {dimensions}")
        
#         # Save as NIFTI
#         log_message("Saving as NIFTI...")
#         success = slicer.util.saveNode(volumeNode, output_path, {"fileType": "NIFTI"})
        
#         if success and os.path.exists(output_path):
#             output_size = os.path.getsize(output_path)
#             log_message(f"✅ SUCCESS: Saved {output_size} bytes")
            
#             # Clean up
#             slicer.mrmlScene.RemoveNode(volumeNode)
#             log_message("Cleaned up volume node")
            
#             # Print result for Node.js to parse
#             result = {
#                 "success": True,
#                 "output_path": output_path,
#                 "output_size": output_size,
#                 "volume_id": volume_id
#             }
#             print(f"CONVERSION_RESULT:{json.dumps(result)}")
#             return True
            
#         else:
#             log_message("❌ Save failed or file not created")
#             slicer.mrmlScene.RemoveNode(volumeNode)
#             print(json.dumps({
#                 "success": False,
#                 "error": "Failed to save NIFTI file"
#             }))
#             return False
        
#     except Exception as e:
#         log_message(f"❌ Error: {str(e)}")
#         import traceback
#         log_message(f"Traceback: {traceback.format_exc()}")
#         print(json.dumps({
#             "success": False,
#             "error": str(e)
#         }))
#         return False

# if __name__ == "__main__":
#     # Initialize log
#     try:
#         os.makedirs(os.path.dirname(log_file), exist_ok=True)
#         with open(log_file, "w", encoding="utf-8") as f:
#             f.write(f"=== Kretz conversion started at {time.strftime('%Y-%m-%d %H:%M:%S')} ===\n")
#     except Exception as e:
#         print(f"Warning: Could not initialize log file: {e}")
    
#     try:
#         log_message("Script starting...")
#         success = main()
#         log_message(f"Script completed: {success}")
#         sys.exit(0 if success else 1)
#     except Exception as e:
#         log_message(f"💥 Fatal error: {str(e)}")
#         import traceback
#         log_message(traceback.format_exc())
#         sys.exit(1)
    
#     log_message("=== Script finished ===")

# working fine as of now 
import os
import sys
import time
import json
import slicer

# Auto-install supabase if not available
def ensure_supabase_installed():
    try:
        import supabase
        return True
    except ImportError:
        log_message("⚠️ supabase module not found, attempting to install...")
        try:
            import subprocess
            python_exe = sys.executable
            subprocess.check_call([python_exe, "-m", "pip", "install", "supabase"], 
                                stdout=subprocess.PIPE, 
                                stderr=subprocess.PIPE)
            log_message("✅ supabase module installed successfully")
            import supabase
            return True
        except Exception as e:
            log_message(f"❌ Failed to install supabase: {e}")
            return False

# Log file path
log_file = r"C:\Users\igrs\project-anu\Vol-conversion\conversion_logs\conversion_kretz_log.txt"

def log_message(message):
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    full_message = f"[{timestamp}] {message}"
    print(full_message)
    sys.stdout.flush()
    
    try:
        os.makedirs(os.path.dirname(log_file), exist_ok=True)
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(full_message + "\n")
            f.flush()
    except Exception as e:
        print(f"Warning: Could not write to log file: {e}")

# Ensure supabase is available before importing
if not ensure_supabase_installed():
    print(json.dumps({
        "success": False,
        "error": "Failed to install required supabase module"
    }))
    sys.exit(1)

from supabase import create_client, Client

# Supabase configuration
SUPABASE_URL = os.environ.get('SUPABASE_URL', 'https://rnrnzmqtvcyqhpakynls.supabase.co')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJucm56bXF0dmN5cWhwYWt5bmxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjIxNDkzMCwiZXhwIjoyMDY3NzkwOTMwfQ.1HU9POYv9RonEgV8gERh1kNpUeCIGaetLO7o0ySUk9o')
BUCKET_NAME = 'projectanu'

def upload_to_supabase(local_path, volume_id, volume_name):
    """Upload converted NIFTI file to Supabase Storage"""
    try:
        log_message("Initializing Supabase client...")
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Create storage path: converted_vol_files/volume_id_filename.nii
        filename = os.path.basename(local_path)
        storage_path = f"converted_vol_files/{filename}"
        
        log_message(f"Uploading to Supabase: {storage_path}")
        
        # Read file as binary
        with open(local_path, 'rb') as f:
            file_data = f.read()
        
        # Upload to Supabase Storage
        response = supabase.storage.from_(BUCKET_NAME).upload(
            path=storage_path,
            file=file_data,
            file_options={
                "content-type": "application/octet-stream",
                "upsert": "true"
            }
        )
        
        log_message(f"✅ Upload successful: {storage_path}")
        
        # Get public URL
        public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(storage_path)
        log_message(f"Public URL: {public_url}")
        
        # Calculate file sizes
        file_size_bytes = len(file_data)
        file_size_kb = file_size_bytes / 1024
        file_size_mb = file_size_kb / 1024
        
        log_message(f"File size: {file_size_bytes} bytes ({file_size_kb:.2f} KB, {file_size_mb:.2f} MB)")
        
        # Delete local file after successful upload
        try:
            os.remove(local_path)
            log_message(f"🗑️ Deleted local file: {local_path}")
        except Exception as e:
            log_message(f"Warning: Could not delete local file: {e}")
        
        return {
            "success": True,
            "storage_path": storage_path,
            "public_url": public_url,
            "file_size_bytes": file_size_bytes,
            "file_size_kb": round(file_size_kb, 2),
            "file_size_mb": round(file_size_mb, 2)
        }
        
    except Exception as e:
        log_message(f"❌ Supabase upload failed: {str(e)}")
        import traceback
        log_message(traceback.format_exc())
        return {
            "success": False,
            "error": str(e)
        }

def main():
    log_message("=== Kretz VOL to NIFTI Conversion (with Supabase Upload) ===")
    
    # Get arguments from Node.js
    if len(sys.argv) < 4:
        log_message("ERROR: Missing arguments. Expected: volumeId, inputPath, volumeName")
        return False
    
    volume_id = sys.argv[1]
    input_path = sys.argv[2]
    volume_name = sys.argv[3]
    
    log_message(f"Volume ID: {volume_id}")
    log_message(f"Input file: {input_path}")
    log_message(f"Volume name: {volume_name}")
    
    # Temporary output folder (will be deleted after upload)
    output_folder = r"C:\Users\igrs\project-anu\Vol-conversion\temp_nifti"
    
    # Check if Kretz file reader is available
    try:
        module_names = [name for name in dir(slicer.modules) if not name.startswith('_')]
        kretz_modules = [name for name in module_names if 'kretz' in name.lower()]
        
        log_message(f"Available Kretz-related modules: {kretz_modules}")
        
        if kretz_modules:
            log_message("✅ Kretz file reader modules found")
        else:
            log_message("⚠️ No Kretz file reader modules found, will try generic loading")
            
    except Exception as e:
        log_message(f"Error checking modules: {e}")
    
    # Check input file
    if not os.path.exists(input_path):
        log_message(f"❌ Input file does not exist: {input_path}")
        return False
    
    file_size = os.path.getsize(input_path)
    log_message(f"Input file size: {file_size} bytes")
    
    # Create temporary output folder
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
        log_message("✅ Created temporary output folder")
    
    # Generate output filename
    base_name = os.path.splitext(os.path.basename(input_path))[0]
    output_filename = f"{volume_id}_{base_name}.nii"
    output_path = os.path.join(output_folder, output_filename)
    
    log_message(f"Temporary output: {output_path}")
    
    try:
        # Try loading with Kretz-specific properties first
        log_message("Attempting to load Kretz VOL file...")
        
        properties = {
            'fileName': input_path,
            'name': volume_name,
            'scanConvert': True,
            'outputSpacing': 0.5
        }
        
        volumeNode = None
        
        # Try Kretz-specific loader
        try:
            volumeNode = slicer.util.loadNodeFromFile(input_path, "KretzFile", properties)
        except Exception as e:
            log_message(f"Kretz loader not available: {e}")
        
        # Fallback to generic volume loader
        if volumeNode is None:
            log_message("Trying generic volume loader...")
            volumeNode = slicer.util.loadVolume(input_path)
        
        if volumeNode is None:
            log_message("❌ All loading methods failed")
            print(json.dumps({
                "success": False,
                "error": "Failed to load volume file"
            }))
            return False
        
        log_message(f"✅ Successfully loaded: {volumeNode.GetName()}")
        log_message(f"Node class: {volumeNode.GetClassName()}")
        
        # Check image data
        if not volumeNode.GetImageData():
            log_message("❌ No image data in loaded volume")
            slicer.mrmlScene.RemoveNode(volumeNode)
            print(json.dumps({
                "success": False,
                "error": "No image data in volume"
            }))
            return False
        
        dimensions = volumeNode.GetImageData().GetDimensions()
        log_message(f"Image dimensions: {dimensions}")
        
        # Save as NIFTI (temporarily)
        log_message("Saving as NIFTI...")
        success = slicer.util.saveNode(volumeNode, output_path, {"fileType": "NIFTI"})
        
        # Clean up Slicer node
        slicer.mrmlScene.RemoveNode(volumeNode)
        log_message("Cleaned up volume node")
        
        if success and os.path.exists(output_path):
            local_size = os.path.getsize(output_path)
            log_message(f"✅ NIFTI saved locally: {local_size} bytes")
            
            # Upload to Supabase
            log_message("📤 Starting upload to Supabase...")
            upload_result = upload_to_supabase(output_path, volume_id, volume_name)
            
            if upload_result["success"]:
                # Print result for Node.js to parse
                result = {
                    "success": True,
                    "storage_path": upload_result["storage_path"],
                    "public_url": upload_result["public_url"],
                    "file_size_bytes": upload_result["file_size_bytes"],
                    "file_size_kb": upload_result["file_size_kb"],
                    "file_size_mb": upload_result["file_size_mb"],
                    "volume_id": volume_id
                }
                print(f"CONVERSION_RESULT:{json.dumps(result)}")
                return True
            else:
                log_message("❌ Upload to Supabase failed")
                print(json.dumps({
                    "success": False,
                    "error": f"Upload failed: {upload_result.get('error', 'Unknown error')}"
                }))
                return False
            
        else:
            log_message("❌ Save failed or file not created")
            print(json.dumps({
                "success": False,
                "error": "Failed to save NIFTI file"
            }))
            return False
        
    except Exception as e:
        log_message(f"❌ Error: {str(e)}")
        import traceback
        log_message(f"Traceback: {traceback.format_exc()}")
        print(json.dumps({
            "success": False,
            "error": str(e)
        }))
        return False

if __name__ == "__main__":
    # Initialize log
    try:
        os.makedirs(os.path.dirname(log_file), exist_ok=True)
        with open(log_file, "w", encoding="utf-8") as f:
            f.write(f"=== Kretz conversion started at {time.strftime('%Y-%m-%d %H:%M:%S')} ===\n")
    except Exception as e:
        print(f"Warning: Could not initialize log file: {e}")
    
    try:
        log_message("Script starting...")
        success = main()
        log_message(f"Script completed: {success}")
        sys.exit(0 if success else 1)
    except Exception as e:
        log_message(f"💥 Fatal error: {str(e)}")
        import traceback
        log_message(traceback.format_exc())
        sys.exit(1)
        
    log_message("=== Script finished ===")