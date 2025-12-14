package br.com.phricardo.listvideo.repository;

import br.com.phricardo.listvideo.model.SavedCourse;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SavedCourseRepository extends JpaRepository<SavedCourse, UUID> {

  Optional<SavedCourse> findByUserIdAndYoutubePlaylistId(String userId, String youtubePlaylistId);

  List<SavedCourse> findAllByUserIdOrderByCreatedAtAsc(String userId);
}
